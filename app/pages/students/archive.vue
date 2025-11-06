<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Arxiv talabalar</h2>
        <p class="text-muted-foreground">
          Arxivlangan talaba hisoblarini boshqarish
        </p>
      </div>
    </div>

    <div class="space-y-4">
      <div class="flex items-center gap-2">
        <Input
          v-model="search"
          placeholder="Talabalarni qidirish..."
          class="max-w-sm"
        />
      </div>

      <!-- Students Table -->
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ism</TableHead>
              <TableHead>Login</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Kurs</TableHead>
              <TableHead>Holat</TableHead>
              <TableHead>Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="isLoading">
              <TableCell colspan="7" class="text-center py-10">
                <div class="flex justify-center">
                  <Icon
                    name="lucide:loader-2"
                    class="h-8 w-8 animate-spin text-primary"
                  />
                </div>
                <p class="text-muted-foreground mt-2">Talabalar yuklanmoqda...</p>
              </TableCell>
            </TableRow>
            <TableRow v-else-if="filteredStudents.length === 0">
              <TableCell colspan="7" class="text-center py-10">
                <div class="flex justify-center">
                  <Icon
                    name="lucide:users-x"
                    class="h-8 w-8 text-muted-foreground"
                  />
                </div>
                <p class="text-muted-foreground mt-2">Talabalar topilmadi</p>
                <Button variant="link" @click="loadStudents" class="mt-2">
                  Ma'lumotlarni yangilash
                </Button>
              </TableCell>
            </TableRow>
            <TableRow
              v-for="student in filteredStudents"
              :key="student.user_id"
            >
              <TableCell class="font-medium">
                <div class="flex items-center">
                  <Avatar class="h-8 w-8 mr-2">
                    <AvatarFallback>{{
                      getInitials(student.first_name, student.last_name)
                    }}</AvatarFallback>
                  </Avatar>
                  {{ student.first_name }} {{ student.last_name }}
                </div>
              </TableCell>
              <TableCell>{{ student.username }}</TableCell>
              <TableCell>{{ student.phone }}</TableCell>
              <TableCell>
                <Badge v-if="getStudentCourse(student)" variant="outline">
                  {{ getStudentCourse(student)?.title }}
                </Badge>
                <span v-else class="text-muted-foreground text-sm">Yo'q</span>
              </TableCell>
              <TableCell>
                <Badge :variant="student.is_active ? 'default' : 'secondary'">
                  {{ student.is_active ? "Faol" : "Nofaol" }}
                </Badge>
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="viewStudent(student)"
                  >
                    <Icon name="lucide:eye" class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="editStudent(student)"
                  >
                    <Icon name="lucide:pencil" class="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon">
                        <Icon name="lucide:more-vertical" class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="toggleStudentStatus(student)">
                        <Icon
                          :name="
                            student.is_active
                              ? 'lucide:user-x'
                              : 'lucide:user-check'
                          "
                          class="mr-2 h-4 w-4"
                        />
                        {{ student.is_active ? "Faolsizlantirish" : "Faollashtirish" }}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between py-4">
        <div class="text-sm text-muted-foreground">
          <span class="font-medium">{{ paginationStart }}</span> dan
          <span class="font-medium">{{ paginationEnd }}</span> gacha,
          jami <span class="font-medium">{{ totalItems }}</span> talaba
        </div>

        <Pagination
          :items-per-page="limit"
          :total="totalItems"
          :default-page="page"
          @update:page="onPageChange"
        >
          <PaginationContent>
            <PaginationPrevious
              :disabled="page === 1"
              @click="navigatePage(page - 1)"
            />

            <PaginationItem
              v-for="pageNum in displayedPages"
              :key="pageNum"
              :value="pageNum"
              :is-active="pageNum === page"
              @click="navigatePage(pageNum)"
            >
              {{ pageNum }}
            </PaginationItem>

            <PaginationEllipsis v-if="showEndEllipsis" />

            <PaginationNext
              :disabled="page === totalPages"
              @click="navigatePage(page + 1)"
            />
          </PaginationContent>
        </Pagination>
      </div>
    </div>

    <!-- View Student Dialog -->
    <Dialog v-model:open="viewDialog">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Talaba ma'lumotlari</DialogTitle>
          <DialogDescription>
            Talaba haqida batafsil ma'lumot
          </DialogDescription>
        </DialogHeader>
        <div v-if="selectedStudent" class="py-4">
          <div class="flex items-center gap-4 mb-4">
            <Avatar class="h-16 w-16">
              <AvatarFallback class="text-lg">
                {{
                  getInitials(
                    selectedStudent.first_name,
                    selectedStudent.last_name
                  )
                }}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 class="text-lg font-semibold">
                {{ selectedStudent.first_name }} {{ selectedStudent.last_name }}
              </h3>
              <p class="text-muted-foreground">
                {{ selectedStudent.username }}
              </p>
            </div>
            <Badge
              :variant="selectedStudent.is_active ? 'default' : 'secondary'"
              class="ml-auto"
            >
              {{ selectedStudent.is_active ? "Faol" : "Nofaol" }}
            </Badge>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium text-sm">Aloqa ma'lumotlari</h4>
              <div class="space-y-1 mt-2">
                <div class="flex">
                  <span class="text-muted-foreground w-20">Telefon:</span>
                  <span>{{ selectedStudent.phone }}</span>
                </div>
                <div class="flex">
                  <span class="text-muted-foreground w-20">Email:</span>
                  <span>{{ selectedStudent.email || "Berilmagan" }}</span>
                </div>
                <div class="flex">
                  <span class="text-muted-foreground w-20">Kurs:</span>
                  <span>
                    <Badge
                      v-if="getStudentCourse(selectedStudent)"
                      variant="outline"
                    >
                      {{ getStudentCourse(selectedStudent)?.title }}
                    </Badge>
                    <span v-else>Yo'q</span>
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 class="font-medium text-sm">Tizim ma'lumotlari</h4>
              <div class="space-y-1 mt-2">
                <div class="flex">
                  <span class="text-muted-foreground w-20">ID:</span>
                  <span class="text-xs font-mono">{{
                    selectedStudent.user_id
                  }}</span>
                </div>
                <div class="flex">
                  <span class="text-muted-foreground w-20">Rollar:</span>
                  <div class="flex gap-1 flex-wrap">
                    <Badge
                      v-for="role in selectedStudent.roles"
                      :key="role"
                      variant="outline"
                      class="text-xs"
                    >
                      {{ role.name }}
                    </Badge>
                  </div>
                </div>
                <div class="flex">
                  <span class="text-muted-foreground w-20">Yaratilgan:</span>
                  <span>{{ formatDate(selectedStudent.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <h4 class="font-medium text-sm">Profil statistikasi</h4>
            <div class="grid grid-cols-3 gap-4 mt-2">
              <div class="bg-muted/40 p-3 rounded-lg">
                <div class="text-sm text-muted-foreground">Ballar</div>
                <div class="text-2xl font-semibold">
                  {{ selectedStudent.student_profile?.points || 0 }}
                </div>
              </div>
              <div class="bg-muted/40 p-3 rounded-lg">
                <div class="text-sm text-muted-foreground">Tangalar</div>
                <div class="text-2xl font-semibold">
                  {{ selectedStudent.student_profile?.coins || 0 }}
                </div>
              </div>
              <div class="bg-muted/40 p-3 rounded-lg">
                <div class="text-sm text-muted-foreground">Izchillik</div>
                <div class="text-2xl font-semibold">
                  {{ selectedStudent.student_profile?.streaks || 0 }} kun
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <h4 class="font-medium text-sm">Yozilgan guruhlar</h4>
            <div class="mt-2 space-y-2">
              <div
                v-if="studentGroups.length === 0"
                class="text-sm text-muted-foreground"
              >
                Hech qanday guruhga yozilmagan
              </div>
              <div
                v-for="group in studentGroups"
                :key="group.id"
                class="flex justify-between items-center p-2 rounded-md bg-muted/40"
              >
                <div>
                  <div class="font-medium">{{ group.name }}</div>
                  <div class="text-xs text-muted-foreground">
                    Yozilgan: {{ formatDate(group.enrolled_at) }}
                  </div>
                </div>
                <Badge>{{ group.status }}</Badge>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="viewDialog = false">Yopish</Button>
          <Button @click="editStudent(selectedStudent)">Tahrirlash</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Edit Student Dialog -->
    <Dialog v-model:open="editDialog">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Talabani tahrirlash</DialogTitle>
          <DialogDescription> Talaba ma'lumotlarini yangilash </DialogDescription>
        </DialogHeader>
        <form v-if="editingStudent" @submit.prevent="updateStudent">
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="edit_first_name" class="text-right">Ism</Label>
              <Input
                id="edit_first_name"
                v-model="editingStudent.first_name"
                class="col-span-3"
              />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="edit_last_name" class="text-right">Familiya</Label>
              <Input
                id="edit_last_name"
                v-model="editingStudent.last_name"
                class="col-span-3"
              />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="edit_username" class="text-right">Login</Label>
              <Input
                id="edit_username"
                v-model="editingStudent.username"
                class="col-span-3"
              />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="edit_phone" class="text-right">Telefon</Label>
              <Input
                id="edit_phone"
                v-model="editingStudent.phone"
                class="col-span-3"
              />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="edit_level_id" class="text-right">Daraja</Label>
              <div class="col-span-3">
                <Select v-model="editingStudent.level_id">
                  <SelectTrigger id="edit_level_id">
                    <SelectValue placeholder="Darajani tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Yo'q</SelectItem>
                    <SelectItem
                      v-for="course in courses"
                      :key="course.id"
                      :value="course.id"
                    >
                      {{ course.title }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" @click="editDialog = false"
              >Bekor qilish</Button
            >
            <Button type="submit" :disabled="isUpdating">
              <Icon
                v-if="isUpdating"
                name="lucide:loader-2"
                class="mr-2 h-4 w-4 animate-spin"
              />
              {{ isUpdating ? "Yangilanmoqda..." : "Talabani yangilash" }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Confirmation Dialog -->
    <AlertDialog v-model:open="confirmDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ishonchingiz komilmi?</AlertDialogTitle>
          <AlertDialogDescription>
            Bu amalni bekor qilib bo'lmaydi. Bu talabaning hisobini butunlay o'chiradi va barcha bog'langan ma'lumotlarni olib tashlaydi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
          <AlertDialogAction
            @click="confirmDelete"
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Icon
              v-if="isDeleting"
              name="lucide:loader-2"
              class="mr-2 h-4 w-4 animate-spin"
            />
            {{ isDeleting ? "O'chirilmoqda..." : "O'chirish" }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import type { Student, GroupStudent } from "~/types";
import { api } from "~/lib/api";
import { useAuth } from "~/composables/useAuth";
import { useToast } from "~/composables/useToast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const { apiService } = useAuth();
const { toast } = useToast();

// Students data
const students = ref<Student[]>([]);
const courses = ref<any[]>([]);
const isLoading = ref(true);
const page = ref(1);
const limit = ref(10);
const totalItems = ref(0);
const totalPages = ref(1);
const showPassword = ref(false);

// Filters and search
const search = ref("");
const filters = reactive({
  active: true,
  inactive: true,
});

// Selected student data
const selectedStudent = ref<Student | null>(null);
const viewDialog = ref(false);
const editDialog = ref(false);
const confirmDialog = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);
const editingStudent = ref<Partial<Student> | null>(null);
const studentToDelete = ref<Student | null>(null);
const studentGroups = ref<any[]>([]);

// New student form
const newStudent = reactive({
  first_name: "",
  last_name: "",
  username: "",
  phone: "",
  password: "",
  level_id: "none",
});

// Computed
const filteredStudents = computed(() => {
  let result = [...students.value];

  // Apply search filter
  if (search.value) {
    const searchLower = search.value.toLowerCase();
    result = result.filter(
      (student) =>
        student.first_name.toLowerCase().includes(searchLower) ||
        student.last_name.toLowerCase().includes(searchLower) ||
        student.username.toLowerCase().includes(searchLower) ||
        student.phone.includes(search.value)
    );
  }

  // Apply status filters
  if (!filters.active && !filters.inactive) {
    return [];
  } else if (filters.active && !filters.inactive) {
    result = result.filter((student) => student.is_active);
  } else if (!filters.active && filters.inactive) {
    result = result.filter((student) => !student.is_active);
  }

  // Update totals based on filtered results
  totalItems.value = result.length;
  totalPages.value = Math.ceil(totalItems.value / limit.value);

  // Apply pagination
  const startIndex = (page.value - 1) * limit.value;
  const endIndex = startIndex + limit.value;
  return result.slice(startIndex, endIndex);
});

const paginationStart = computed(() => {
  return totalItems.value === 0 ? 0 : (page.value - 1) * limit.value + 1;
});

const paginationEnd = computed(() => {
  return Math.min(page.value * limit.value, totalItems.value);
});

// Pagination display helpers
const displayedPages = computed(() => {
  if (totalPages.value <= 7) {
    // If we have 7 or fewer pages, show all pages
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }

  // Always show first and last page
  // For current page, show 1 page before and 1 page after when possible
  const pages = [];

  // Always include page 1
  pages.push(1);

  // If we're at the start, show pages 2 and 3
  if (page.value <= 3) {
    pages.push(2, 3, 4);
  }
  // If we're at the end, show the last few pages
  else if (page.value >= totalPages.value - 2) {
    pages.push(
      totalPages.value - 3,
      totalPages.value - 2,
      totalPages.value - 1
    );
  }
  // Otherwise show current page and surrounding pages
  else {
    pages.push(page.value - 1, page.value, page.value + 1);
  }

  // Always include last page if not already included
  if (!pages.includes(totalPages.value)) {
    pages.push(totalPages.value);
  }

  return [...new Set(pages)].sort((a, b) => a - b);
});

// Show ellipsis if there are gaps in the pagination
const showEndEllipsis = computed(() => {
  const lastDisplayedPage = Math.max(...displayedPages.value);
  return lastDisplayedPage < totalPages.value;
});

// Methods
const loadStudents = async () => {
  isLoading.value = true;
  try {
    // Since the endpoint doesn't support query params, fetch all students
    const response = await api.get<Student[]>(
      apiService.value,
      "/users/students/archived"
    );

    students.value = response.map((student) => ({
      ...student,
    }));

    // Total count will be updated by filteredStudents computed property
    totalItems.value = students.value.length;
    totalPages.value = Math.ceil(totalItems.value / limit.value);
  } catch (error) {
    console.error("Failed to load students:", error);
    toast({
      title: "Error",
      description: "Failed to load students. Please try again.",
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
};

const addStudent = async () => {
  isLoading.value = true;
  try {
    // Create a copy of newStudent to prepare for submission
    const studentData = { ...newStudent };

    // Set level_id to empty string if it's 'none'
    if (studentData.level_id === "none") {
      studentData.level_id = "";
    }

    // In a real app this would use a specific endpoint to create a student
    const response = await api.post<Student>(
      apiService.value,
      "/auth/register",
      studentData
    );

    students.value.push({
      ...response,
      is_active: true,
    });

    totalItems.value = students.value.length;
    toast({
      title: "Success",
      description: "Student created successfully",
    });

    // Reset form
    Object.keys(newStudent).forEach((key) => {
      newStudent[key as keyof typeof newStudent] = "";
    });
    // Set level_id specifically to none after reset
    newStudent.level_id = "none";
  } catch (error) {
    console.error("Failed to create student:", error);
    toast({
      title: "Error",
      description: "Failed to create student. Please try again.",
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
};

const viewStudent = async (student: Student) => {
  selectedStudent.value = student;
  viewDialog.value = true;

  // Load student groups
  try {
    const response = await api.get<GroupStudent[]>(
      apiService.value,
      `/group-students/student/${student.user_id}`
    );
    studentGroups.value = response;
  } catch (error) {
    console.error("Failed to load student groups:", error);
    studentGroups.value = [];
  }
};

const editStudent = (student: Student | null) => {
  if (!student) return;

  // Close view dialog if open
  viewDialog.value = false;

  // Clone student data for editing
  editingStudent.value = { ...student };

  // Set level_id to "none" if it's empty or null
  if (!editingStudent.value.level_id) {
    editingStudent.value.level_id = "none";
  }

  editDialog.value = true;
};

const updateStudent = async () => {
  if (!editingStudent.value || !editingStudent.value.user_id) return;

  isUpdating.value = true;
  try {
    // Create a copy of editingStudent to prepare for submission
    const studentData = { ...editingStudent.value };

    // Set level_id to empty string if it's 'none'
    if (studentData.level_id === "none") {
      studentData.level_id = "";
    }

    const response = await api.patch<Student>(
      apiService.value,
      `/users/${editingStudent.value.user_id}`,
      studentData
    );

    // Update student in list
    const index = students.value.findIndex(
      (s) => s.user_id === response.user_id
    );
    if (index !== -1) {
      students.value[index] = {
        ...response,
      };
    }

    toast({
      title: "Success",
      description: "Student updated successfully",
    });

    editDialog.value = false;
  } catch (error) {
    console.error("Failed to update student:", error);
    toast({
      title: "Error",
      description: "Failed to update student. Please try again.",
      variant: "destructive",
    });
  } finally {
    isUpdating.value = false;
  }
};

const toggleStudentStatus = async (student: Student) => {
  try {
    const endpoint = student.is_active
      ? `/users/${student.user_id}/deactivate`
      : `/users/${student.user_id}/activate`;

    await api.patch<Student>(apiService.value, endpoint, {});

    // Update student status locally
    const index = students.value.findIndex(
      (s) => s.user_id === student.user_id
    );
    if (index !== -1) {
      students.value[index] = {
        ...students.value[index],
        is_active: !student.is_active,
      };
    }

    toast({
      title: "Success",
      description: `Student ${
        student.is_active ? "deactivated" : "activated"
      } successfully`,
    });
  } catch (error) {
    console.error("Failed to toggle student status:", error);
    toast({
      title: "Error",
      description: "Failed to update student status. Please try again.",
      variant: "destructive",
    });
  }
};

const viewStudentGroups = (student: Student) => {
  navigateTo(`/groups/student/${student.user_id}`);
};

const deleteStudent = (student: Student) => {
  studentToDelete.value = student;
  confirmDialog.value = true;
};

const confirmDelete = async () => {
  if (!studentToDelete.value) return;

  isDeleting.value = true;
  try {
    await api.delete<void>(
      apiService.value,
      `/users/${studentToDelete.value.user_id}`
    );

    // Remove student from list
    students.value = students.value.filter(
      (s) => s.user_id !== studentToDelete.value?.user_id
    );
    totalItems.value = students.value.length;

    toast({
      title: "Success",
      description: "Student deleted successfully",
    });

    confirmDialog.value = false;
  } catch (error) {
    console.error("Failed to delete student:", error);
    toast({
      title: "Error",
      description: "Failed to delete student. Please try again.",
      variant: "destructive",
    });
  } finally {
    isDeleting.value = false;
  }
};

// Helper functions
const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

const loadCourses = async () => {
  try {
    const response = await api.get<any[]>(apiService.value, "/courses");
    courses.value = response || [];
  } catch (error) {
    console.error("Failed to load courses:", error);
    toast({
      title: "Error",
      description: "Failed to load courses. Please try again.",
      variant: "destructive",
    });
  }
};

const getStudentCourse = (student: Student) => {
  if (!student.level_id) return null;
  return courses.value.find((course) => course.id === student.level_id) || null;
};

// Load students on component mount
onMounted(() => {
  // Get the pagination parameters from URL
  const route = useRoute();
  if (route.query.page) {
    page.value = parseInt(route.query.page as string) || 1;
  }
  if (route.query.limit) {
    limit.value = parseInt(route.query.limit as string) || 10;
  }

  // Handle search from URL
  if (route.query.search) {
    search.value = route.query.search as string;
  }

  loadStudents();
  loadCourses();
});

// Navigation functions for pagination
const navigatePage = (newPage: number) => {
  page.value = newPage;
  updateUrlParams();
};

const onPageChange = (newPage: number) => {
  page.value = newPage;
  updateUrlParams();
};

const route = useRoute();
const router = useRouter();

const updateUrlParams = () => {
  // Create query object with pagination params
  const query: Record<string, string> = {
    page: page.value.toString(),
    limit: limit.value.toString(),
  };

  // Add search param if it exists
  if (search.value) {
    query.search = search.value;
  }

  // Update URL with all params
  router.push({ query });
};

// Watch for filter changes and reset to page 1
watch(
  [search, filters],
  () => {
    // Reset to page 1 when filters change
    page.value = 1;
    // Update URL params
    updateUrlParams();
  },
  { deep: true }
);
</script>
