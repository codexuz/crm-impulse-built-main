<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">O'qituvchilar</h2>
        <p class="text-muted-foreground">
          O'qituvchi hisoblarini va ma'lumotlarini boshqarish
        </p>
      </div>
      <Dialog>
        <DialogTrigger as-child>
          <Button>
            <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
            O'qituvchi qo'shish
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Yangi o'qituvchi qo'shish</DialogTitle>
            <DialogDescription>
              Tizimda yangi o'qituvchi hisobi yaratish
            </DialogDescription>
          </DialogHeader>
          <form @submit.prevent="addTeacher">
            <div class="grid gap-4 py-4">
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="first_name" class="text-right">Ism</Label>
                <Input
                  id="first_name"
                  v-model="newTeacher.first_name"
                  class="col-span-3"
                />
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="last_name" class="text-right">Familiya</Label>
                <Input
                  id="last_name"
                  v-model="newTeacher.last_name"
                  class="col-span-3"
                />
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="username" class="text-right">Login</Label>
                <Input
                  id="username"
                  v-model="newTeacher.username"
                  class="col-span-3"
                />
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="phone" class="text-right">Telefon</Label>
                <Input
                  id="phone"
                  v-model="newTeacher.phone"
                  class="col-span-3"
                />
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="password" class="text-right">Parol</Label>
                <div class="relative col-span-3">
                  <Input
                    id="password"
                    v-model="newTeacher.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    class="absolute inset-y-0 right-0 h-full"
                    @click="showPassword = !showPassword"
                  >
                    <Icon
                      :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
                      class="h-4 w-4"
                    />
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" :disabled="isLoading">
                <Icon
                  v-if="isLoading"
                  name="lucide:loader-2"
                  class="mr-2 h-4 w-4 animate-spin"
                />
                {{ isLoading ? "Yaratilmoqda..." : "O'qituvchi yaratish" }}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <div class="space-y-4">
      <div class="flex items-center gap-2">
        <Input
          v-model="search"
          placeholder="Search teachers..."
          class="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" class="ml-auto">
              <Icon name="lucide:filter" class="mr-2 h-4 w-4" />
              Filter
              <Icon name="lucide:chevron-down" class="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem v-model:checked="filters.active">
              Active Teachers
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem v-model:checked="filters.inactive">
              Inactive Teachers
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <!-- Teachers Table -->
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Groups</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="isLoading">
              <TableCell colspan="6" class="text-center py-10">
                <div class="flex justify-center">
                  <Icon
                    name="lucide:loader-2"
                    class="h-8 w-8 animate-spin text-primary"
                  />
                </div>
                <p class="text-muted-foreground mt-2">Loading teachers...</p>
              </TableCell>
            </TableRow>
            <TableRow v-else-if="filteredTeachers.length === 0">
              <TableCell colspan="6" class="text-center py-10">
                <div class="flex justify-center">
                  <Icon
                    name="lucide:users-x"
                    class="h-8 w-8 text-muted-foreground"
                  />
                </div>
                <p class="text-muted-foreground mt-2">No teachers found</p>
                <Button variant="link" @click="loadTeachers" class="mt-2">
                  Refresh data
                </Button>
              </TableCell>
            </TableRow>
            <TableRow
              v-for="teacher in filteredTeachers"
              :key="teacher.user_id"
            >
              <TableCell class="font-medium">
                <div class="flex items-center">
                  <Avatar class="h-8 w-8 mr-2">
                    <AvatarFallback>{{
                      getInitials(teacher.first_name, teacher.last_name)
                    }}</AvatarFallback>
                  </Avatar>
                  {{ teacher.first_name }} {{ teacher.last_name }}
                </div>
              </TableCell>
              <TableCell>{{ teacher.username }}</TableCell>
              <TableCell>{{ teacher.phone }}</TableCell>
              <TableCell>
                <Badge :variant="teacher.is_active ? 'default' : 'secondary'">
                  {{ teacher.is_active ? "Active" : "Inactive" }}
                </Badge>
              </TableCell>
              <TableCell>{{ teacher.groupCount || 0 }}</TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="viewTeacher(teacher)"
                  >
                    <Icon name="lucide:eye" class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="editTeacher(teacher)"
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
                      <DropdownMenuItem @click="toggleTeacherStatus(teacher)">
                        <Icon
                          :name="
                            teacher.is_active
                              ? 'lucide:user-x'
                              : 'lucide:user-check'
                          "
                          class="mr-2 h-4 w-4"
                        />
                        {{ teacher.is_active ? "Deactivate" : "Activate" }}
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="viewTeacherGroups(teacher)">
                        <Icon name="lucide:users-2" class="mr-2 h-4 w-4" />
                        View Groups
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        @click="deleteTeacher(teacher)"
                        class="text-destructive focus:text-destructive"
                      >
                        <Icon name="lucide:trash-2" class="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-end space-x-2 py-4">
        <div class="flex-1 text-sm text-muted-foreground">
          {{ paginationText }}
        </div>
        <div class="space-x-2">
          <Button
            variant="outline"
            size="sm"
            :disabled="page === 1"
            @click="page--"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="page >= totalPages"
            @click="page++"
          >
            Next
          </Button>
        </div>
      </div>
    </div>

    <!-- View Teacher Dialog -->
    <Dialog v-model:open="viewDialog">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Teacher Details</DialogTitle>
          <DialogDescription>
            Detailed information about the teacher
          </DialogDescription>
        </DialogHeader>
        <div v-if="selectedTeacher" class="py-4">
          <div class="flex items-center gap-4 mb-4">
            <Avatar class="h-16 w-16">
              <AvatarFallback class="text-lg">
                {{
                  getInitials(
                    selectedTeacher.first_name,
                    selectedTeacher.last_name
                  )
                }}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 class="text-lg font-semibold">
                {{ selectedTeacher.first_name }} {{ selectedTeacher.last_name }}
              </h3>
              <p class="text-muted-foreground">
                {{ selectedTeacher.username }}
              </p>
            </div>
            <Badge
              :variant="selectedTeacher.is_active ? 'default' : 'secondary'"
              class="ml-auto"
            >
              {{ selectedTeacher.is_active ? "Active" : "Inactive" }}
            </Badge>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium text-sm">Contact Information</h4>
              <div class="space-y-1 mt-2">
                <div class="flex">
                  <span class="text-muted-foreground w-20">Phone:</span>
                  <span>{{ selectedTeacher.phone }}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 class="font-medium text-sm">System Information</h4>
              <div class="space-y-1 mt-2">
                <div class="flex">
                  <span class="text-muted-foreground w-20">ID:</span>
                  <span class="text-xs font-mono">{{
                    selectedTeacher.user_id
                  }}</span>
                </div>
                <div class="flex">
                  <span class="text-muted-foreground w-20">Roles:</span>
                  <div class="flex gap-1 flex-wrap">
                    <Badge
                      v-for="role in selectedTeacher.roles"
                      :key="role"
                      variant="outline"
                      class="text-xs"
                    >
                      {{ role.name }}
                    </Badge>
                  </div>
                </div>
                <div class="flex">
                  <span class="text-muted-foreground w-20">Created:</span>
                  <span>{{ formatDate(selectedTeacher.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="viewDialog = false">Close</Button>
          <Button @click="editTeacher(selectedTeacher)">Edit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Edit Teacher Dialog -->
    <Dialog v-model:open="editDialog">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Teacher</DialogTitle>
          <DialogDescription> Update teacher information </DialogDescription>
        </DialogHeader>
        <form v-if="editingTeacher" @submit.prevent="updateTeacher">
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="edit_first_name" class="text-right">First Name</Label>
              <Input
                id="edit_first_name"
                v-model="editingTeacher.first_name"
                class="col-span-3"
              />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="edit_last_name" class="text-right">Last Name</Label>
              <Input
                id="edit_last_name"
                v-model="editingTeacher.last_name"
                class="col-span-3"
              />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="edit_username" class="text-right">Username</Label>
              <Input
                id="edit_username"
                v-model="editingTeacher.username"
                class="col-span-3"
              />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="edit_phone" class="text-right">Phone</Label>
              <Input
                id="edit_phone"
                v-model="editingTeacher.phone"
                class="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" @click="editDialog = false"
              >Cancel</Button
            >
            <Button type="submit" :disabled="isUpdating">
              <Icon
                v-if="isUpdating"
                name="lucide:loader-2"
                class="mr-2 h-4 w-4 animate-spin"
              />
              {{ isUpdating ? "Updating..." : "Update Teacher" }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Confirmation Dialog -->
    <AlertDialog v-model:open="confirmDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            teacher's account and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            @click="confirmDelete"
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Icon
              v-if="isDeleting"
              name="lucide:loader-2"
              class="mr-2 h-4 w-4 animate-spin"
            />
            {{ isDeleting ? "Deleting..." : "Delete" }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import type { Teacher } from "~/types";
import { api } from "~/lib/api";
import { useAuth } from "~/composables/useAuth";
import { useToast } from "~/composables/useToast";

const { apiService } = useAuth();
const { toast } = useToast();

// Teachers data
const teachers = ref<Teacher[]>([]);
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

// Selected teacher data
const selectedTeacher = ref<Teacher | null>(null);
const viewDialog = ref(false);
const editDialog = ref(false);
const confirmDialog = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);
const editingTeacher = ref<Partial<Teacher> | null>(null);
const teacherToDelete = ref<Teacher | null>(null);

// New teacher form
const newTeacher = reactive({
  first_name: "",
  last_name: "",
  username: "",
  phone: "",
  password: "",
});

// Computed
const filteredTeachers = computed(() => {
  let result = [...teachers.value];

  // Apply search filter
  if (search.value) {
    const searchLower = search.value.toLowerCase();
    result = result.filter(
      (teacher) =>
        teacher.first_name.toLowerCase().includes(searchLower) ||
        teacher.last_name.toLowerCase().includes(searchLower) ||
        teacher.username.toLowerCase().includes(searchLower) ||
        teacher.phone.includes(search.value)
    );
  }

  // Apply status filters
  if (!filters.active && !filters.inactive) {
    return [];
  } else if (filters.active && !filters.inactive) {
    result = result.filter((teacher) => teacher.is_active);
  } else if (!filters.active && filters.inactive) {
    result = result.filter((teacher) => !teacher.is_active);
  }

  return result;
});

const paginationText = computed(() => {
  const start = (page.value - 1) * limit.value + 1;
  const end = Math.min(page.value * limit.value, totalItems.value);
  return `Showing ${start} to ${end} of ${totalItems.value} teachers`;
});

// Methods
const loadTeachers = async () => {
  isLoading.value = true;
  try {
    const response = await api.get<Teacher[]>(
      apiService.value,
      "/users/teachers"
    );
    teachers.value = response;
    totalItems.value = response.length;
    totalPages.value = Math.ceil(totalItems.value / limit.value);
  } catch (error) {
    console.error("Failed to load teachers:", error);
    toast({
      title: "Error",
      description: "Failed to load teachers. Please try again.",
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
};

const addTeacher = async () => {
  isLoading.value = true;
  try {
    const response = await api.post<Teacher>(
      apiService.value,
      "/users/teachers",
      newTeacher
    );
    teachers.value.push(response);
    totalItems.value = teachers.value.length;
    toast({
      title: "Success",
      description: "Teacher created successfully",
    });

    // Reset form
    Object.keys(newTeacher).forEach((key) => {
      newTeacher[key as keyof typeof newTeacher] = "";
    });
  } catch (error) {
    console.error("Failed to create teacher:", error);
    toast({
      title: "Error",
      description: "Failed to create teacher. Please try again.",
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
};

const viewTeacher = (teacher: Teacher) => {
  selectedTeacher.value = teacher;
  viewDialog.value = true;
};

const editTeacher = (teacher: Teacher | null) => {
  if (!teacher) return;

  // Close view dialog if open
  viewDialog.value = false;

  // Clone teacher data for editing
  editingTeacher.value = { ...teacher };
  editDialog.value = true;
};

const updateTeacher = async () => {
  if (!editingTeacher.value || !editingTeacher.value.user_id) return;

  isUpdating.value = true;
  try {
    const response = await api.patch<Teacher>(
      apiService.value,
      `/users/${editingTeacher.value.user_id}`,
      editingTeacher.value
    );

    // Update teacher in list
    const index = teachers.value.findIndex(
      (t) => t.user_id === response.user_id
    );
    if (index !== -1) {
      teachers.value[index] = response;
    }

    toast({
      title: "Success",
      description: "Teacher updated successfully",
    });

    editDialog.value = false;
  } catch (error) {
    console.error("Failed to update teacher:", error);
    toast({
      title: "Error",
      description: "Failed to update teacher. Please try again.",
      variant: "destructive",
    });
  } finally {
    isUpdating.value = false;
  }
};

const toggleTeacherStatus = async (teacher: Teacher) => {
  try {
    const endpoint = teacher.is_active
      ? `/users/${teacher.user_id}/deactivate`
      : `/users/${teacher.user_id}/activate`;

    await api.patch<Teacher>(apiService.value, endpoint, {});

    // Update teacher status locally
    const index = teachers.value.findIndex(
      (t) => t.user_id === teacher.user_id
    );
    if (index !== -1) {
      teachers.value[index].is_active = !teacher.is_active;
    }

    toast({
      title: "Success",
      description: `Teacher ${
        teacher.is_active ? "deactivated" : "activated"
      } successfully`,
    });
  } catch (error) {
    console.error("Failed to toggle teacher status:", error);
    toast({
      title: "Error",
      description: "Failed to update teacher status. Please try again.",
      variant: "destructive",
    });
  }
};

const viewTeacherGroups = (teacher: Teacher) => {
  navigateTo(`/groups/teacher/${teacher.user_id}`);
};

const deleteTeacher = (teacher: Teacher) => {
  teacherToDelete.value = teacher;
  confirmDialog.value = true;
};

const confirmDelete = async () => {
  if (!teacherToDelete.value) return;

  isDeleting.value = true;
  try {
    await api.delete<void>(
      apiService.value,
      `/users/${teacherToDelete.value.user_id}`
    );

    // Remove teacher from list
    teachers.value = teachers.value.filter(
      (t) => t.user_id !== teacherToDelete.value?.user_id
    );
    totalItems.value = teachers.value.length;

    toast({
      title: "Success",
      description: "Teacher deleted successfully",
    });

    confirmDialog.value = false;
  } catch (error) {
    console.error("Failed to delete teacher:", error);
    toast({
      title: "Error",
      description: "Failed to delete teacher. Please try again.",
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

// Load teachers on component mount
onMounted(() => {
  loadTeachers();
});
</script>
