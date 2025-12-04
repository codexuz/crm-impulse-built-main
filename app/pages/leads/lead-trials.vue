<template>
  <div class="container py-10 space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          title="Leadlarga qaytish"
          @click="router.push('/leads')"
        >
          <Icon name="lucide:arrow-left" class="h-4 w-4" />
        </Button>
        <h1 class="text-3xl font-bold tracking-tight">Sinov darslari</h1>
      </div>
    </div>

    <Card>
      <CardContent class="p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex flex-1 items-center space-x-2">
            <Input
              v-model="searchQuery"
              placeholder="Lead nomi bo'yicha qidirish..."
              class="h-9 w-[300px]"
            />
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline" class="h-9 ml-2">
                  Holat: {{ statusFilter === "" ? "Barchasi" : statusFilter }}
                  <Icon name="lucide:chevron-down" class="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem @click="statusFilter = ''">
                  Barchasi
                </DropdownMenuItem>
                <DropdownMenuItem @click="statusFilter = 'belgilangan'">
                  Belgilangan
                </DropdownMenuItem>
                <DropdownMenuItem @click="statusFilter = 'keldi'">
                  Keldi
                </DropdownMenuItem>
                <DropdownMenuItem @click="statusFilter = 'kelmadi'">
                  Kelmadi
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sana va vaqt</TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>O'qituvchi</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead>Izohlar</TableHead>
                <TableHead class="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-if="loading">
                <TableCell colspan="6" class="text-center py-10">
                  <Spinner class="mx-auto" />
                </TableCell>
              </TableRow>
              <TableRow v-else-if="filteredTrialLessons.length === 0">
                <TableCell colspan="6" class="text-center py-10">
                  Sinov darslari topilmadi.
                </TableCell>
              </TableRow>
              <TableRow
                v-for="trial in paginatedTrialLessons"
                :key="trial.id"
                class="hover:bg-muted/50"
              >
                <TableCell>
                  <div class="font-medium">
                    {{ formatDate(trial.scheduledAt) }}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    {{ formatTime(trial.scheduledAt) }}
                  </div>
                </TableCell>
                <TableCell>
                  <div v-if="trial.leadInfo" class="font-medium">
                    {{ trial.leadInfo.first_name }}
                    {{ trial.leadInfo.last_name }}
                  </div>
                  <div v-else class="text-muted-foreground italic">
                    Lead topilmadi
                  </div>
                  <div
                    v-if="trial.leadInfo"
                    class="text-sm text-muted-foreground"
                  >
                    {{ formatPhone(trial.leadInfo.phone) }}
                  </div>
                </TableCell>
                <TableCell>
                  <div class="font-medium">
                    {{ trial.teacherInfo.first_name }}
                    {{ trial.teacherInfo.last_name }}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    {{ formatPhone(trial.teacherInfo.phone) }}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge :variant="getStatusVariant(trial.status)">
                    {{ trial.status }}
                  </Badge>
                </TableCell>
                <TableCell class="max-w-[200px] truncate">
                  {{ trial.notes || "Izoh yo'q" }}
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      @click.stop="openEditTrialDialog(trial)"
                      title="Sinov darsini tahrirlash"
                    >
                      <Icon name="lucide:pencil" class="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      @click.stop="confirmDeleteTrial(trial)"
                      title="Sinov darsini o'chirish"
                    >
                      <Icon
                        name="lucide:trash-2"
                        class="h-4 w-4 text-destructive"
                      />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-4 py-4">
          <div class="text-sm text-muted-foreground">
            <span class="font-medium">{{ paginationStart }}</span> dan
            <span class="font-medium">{{ paginationEnd }}</span> gacha, jami
            <span class="font-medium">{{ total }}</span> sinov darsi
          </div>

          <Pagination
            :items-per-page="itemsPerPage"
            :total="total"
            :default-page="currentPage"
            @update:page="onPageChange"
          >
            <PaginationContent>
              <PaginationPrevious
                :disabled="currentPage === 1"
                @click="navigatePage(currentPage - 1)"
              />

              <PaginationItem
                v-for="pageNum in displayedPages"
                :key="pageNum"
                :value="pageNum"
                :is-active="pageNum === currentPage"
                @click="navigatePage(pageNum)"
              >
                {{ pageNum }}
              </PaginationItem>

              <PaginationEllipsis v-if="showEndEllipsis" />

              <PaginationNext
                :disabled="currentPage === totalPages"
                @click="navigatePage(currentPage + 1)"
              />
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog v-model:open="showDeleteDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ishonchingiz komilmi?</AlertDialogTitle>
          <AlertDialogDescription>
            Bu amalni qaytarib bo'lmaydi. Sinov darsi va unga tegishli barcha
            ma'lumotlar butunlay o'chiriladi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="showDeleteDialog = false"
            >Bekor qilish</AlertDialogCancel
          >
          <AlertDialogAction
            @click="confirmDelete"
            class="bg-destructive text-white hover:bg-destructive/90"
          >
            O'chirish
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- Edit Trial Lesson Dialog -->
    <Dialog v-model:open="showEditDialog">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sinov darsini tahrirlash</DialogTitle>
          <DialogDescription>
            Sinov darsi holati va izohlarini yangilash.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="status" class="text-right">Holat</Label>
            <div class="col-span-3">
              <Select v-model="editingTrial.status">
                <SelectTrigger>
                  <SelectValue placeholder="Holatni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="belgilangan">Belgilangan</SelectItem>
                  <SelectItem value="keldi">Keldi</SelectItem>
                  <SelectItem value="kelmadi">Kelmadi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="notes" class="text-right">Izohlar</Label>
            <Textarea
              id="notes"
              v-model="editingTrial.notes"
              placeholder="Sinov darsi haqida izoh qo'shing"
              class="col-span-3"
              rows="3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showEditDialog = false"
            >Bekor qilish</Button
          >
          <Button type="submit" @click="saveTrialChanges"
            >O'zgarishlarni saqlash</Button
          >
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import { format, parseISO } from "date-fns";
import { useRouter, useRoute } from "vue-router";
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
} from "~/components/ui/pagination";

interface TeacherInfo {
  user_id: string;
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
}

interface LeadInfo {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: string;
}

interface TrialLesson {
  id: string;
  scheduledAt: string;
  status: string;
  teacher_id: string;
  lead_id: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
  teacherInfo: TeacherInfo;
  leadInfo: LeadInfo | null;
}

interface ApiResponse {
  trialLessons: TrialLesson[];
  total: number;
  totalPages: number;
  currentPage: number;
}

const router = useRouter();
const route = useRoute();
const trialLessons = ref<TrialLesson[]>([]);
const loading = ref(true);
const error = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;
const total = ref(0);
const totalPages = ref(1);
const searchQuery = ref("");
const statusFilter = ref("");
const { auth, apiService } = useAuth();
const toast = useToast();
const showDeleteDialog = ref(false);
const trialToDelete = ref<string | null>(null);
const showEditDialog = ref(false);
const editingTrial = reactive({
  id: "",
  status: "",
  notes: "",
});

// Pagination helpers
const paginationStart = computed(() => {
  return total.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage, total.value);
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
  if (currentPage.value <= 3) {
    pages.push(2, 3, 4);
  }
  // If we're at the end, show the last few pages
  else if (currentPage.value >= totalPages.value - 2) {
    pages.push(
      totalPages.value - 3,
      totalPages.value - 2,
      totalPages.value - 1
    );
  }
  // Otherwise show current page and surrounding pages
  else {
    pages.push(currentPage.value - 1, currentPage.value, currentPage.value + 1);
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

// Navigation functions for pagination
const navigatePage = (newPage: number) => {
  currentPage.value = newPage;
  fetchTrialLessons();
  updateUrlParams();
};

const onPageChange = (newPage: number) => {
  currentPage.value = newPage;
  fetchTrialLessons();
  updateUrlParams();
};

const updateUrlParams = () => {
  // Create query object with pagination params
  const query: Record<string, string> = {
    page: currentPage.value.toString(),
  };

  // Add search param if it exists
  if (searchQuery.value) {
    query.search = searchQuery.value;
  }

  // Add status filter if it exists
  if (statusFilter.value) {
    query.status = statusFilter.value;
  }

  // Update URL with all params
  router.push({ query });
};

// Fetch trial lessons from the API
const fetchTrialLessons = async () => {
  loading.value = true;
  error.value = "";

  try {
    // Add pagination parameters to the request
    const params = new URLSearchParams();
    params.append("page", currentPage.value.toString());
    params.append("limit", itemsPerPage.toString());

    if (searchQuery.value) {
      params.append("search", searchQuery.value);
    }

    if (statusFilter.value) {
      params.append("status", statusFilter.value);
    }

    const url = `/lead-trial-lessons?${params.toString()}`;
    const data = await api.get<ApiResponse>(apiService.value, url);

    trialLessons.value = data.trialLessons;
    total.value = data.total;
    totalPages.value = data.totalPages;
    currentPage.value = data.currentPage;
  } catch (err) {
    console.error("Error fetching trial lessons:", err);
    error.value = "Sinov darslarini yuklashda xatolik.";
    toast.toast({
      title: "Xatolik",
      description: "Sinov darslarini yuklashda xatolik",
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
};

// Filter trial lessons based on search query and status
const filteredTrialLessons = computed(() => {
  return trialLessons.value.filter((trial: TrialLesson) => {
    // Filter by search query (lead name)
    const leadNameMatch =
      !searchQuery.value ||
      (trial.leadInfo &&
        (trial.leadInfo.first_name
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
          trial.leadInfo.last_name
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase())));

    // Filter by status
    const statusMatch =
      !statusFilter.value || trial.status === statusFilter.value;

    return leadNameMatch && statusMatch;
  });
});

// Get paginated trial lessons
const paginatedTrialLessons = computed(() => {
  return filteredTrialLessons.value;
});

// Format date
const formatDate = (dateString: string) => {
  // Parse as UTC to avoid timezone conversion
  const date = new Date(dateString);
  return format(date, "MMM dd, yyyy", { timeZone: "UTC" });
};

// Format time
const formatTime = (dateString: string) => {
  // Parse as UTC to avoid timezone conversion
  const date = new Date(dateString);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

// Format phone number
const formatPhone = (phone: string) => {
  if (!phone) return "";

  // If phone already has a + sign, return as is
  if (phone.startsWith("+")) {
    return phone;
  }

  // If phone is just numbers without country code, add +998
  if (phone.match(/^\d+$/)) {
    return `+998${phone}`;
  }

  return phone;
};

// Get badge variant based on status
const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "belgilangan":
      return "outline";
    case "keldi":
      return "success";
    case "kelmadi":
      return "destructive";
    default:
      return "secondary";
  }
};

// Open dialog to edit an existing trial lesson
const openEditTrialDialog = (trial: TrialLesson) => {
  // Set the current trial data to edit
  editingTrial.id = trial.id;
  editingTrial.status = trial.status;
  editingTrial.notes = trial.notes || "";

  // Open the dialog
  showEditDialog.value = true;
};

// Save changes to trial lesson
const saveTrialChanges = async () => {
  try {
    // Make the API request to update the trial lesson
    await api.patch(
      apiService.value,
      `/lead-trial-lessons/${editingTrial.id}`,
      {
        status: editingTrial.status,
        notes: editingTrial.notes,
      }
    );

    // Update the trial in the local state
    const index = trialLessons.value.findIndex(
      (trial: TrialLesson) => trial.id === editingTrial.id
    );
    if (index !== -1) {
      const trial = trialLessons.value[index];
      if (trial) {
        trial.status = editingTrial.status;
        trial.notes = editingTrial.notes;
      }
    }

    // Show success toast
    toast.toast({
      title: "Success",
      description: "Trial lesson updated successfully",
    });

    // Close the dialog
    showEditDialog.value = false;
  } catch (err) {
    console.error("Error updating trial lesson:", err);
    toast.toast({
      title: "Error",
      description: "Failed to update trial lesson",
      variant: "destructive",
    });
  }
};

// Confirm deletion of a trial lesson
const confirmDeleteTrial = (trial: TrialLesson) => {
  trialToDelete.value = trial.id;
  showDeleteDialog.value = true;
};

// Confirm deletion from dialog
const confirmDelete = async () => {
  if (trialToDelete.value) {
    await deleteTrial(trialToDelete.value);
    showDeleteDialog.value = false;
    trialToDelete.value = null;
  }
};

// Delete a trial lesson
const deleteTrial = async (id: string) => {
  try {
    await api.delete(apiService.value, `/lead-trial-lessons/${id}`);

    // Remove from local state
    trialLessons.value = trialLessons.value.filter(
      (trial: TrialLesson) => trial.id !== id
    );

    // Show success toast
    toast.toast({
      title: "Success",
      description: "Trial lesson deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting trial lesson:", err);
    toast.toast({
      title: "Error",
      description: "Failed to delete trial lesson",
      variant: "destructive",
    });
  }
};

// Fetch data on component mount
onMounted(() => {
  // Get the pagination parameters from URL
  if (route.query.page) {
    currentPage.value = parseInt(route.query.page as string) || 1;
  }

  // Handle search from URL
  if (route.query.search) {
    searchQuery.value = route.query.search as string;
  }

  // Handle status filter from URL
  if (route.query.status) {
    statusFilter.value = route.query.status as string;
  }

  fetchTrialLessons();
});

// Watch for filter changes and reset to page 1
watch(
  [searchQuery, statusFilter],
  () => {
    // Reset to page 1 when filters change
    currentPage.value = 1;
    // Fetch new data with filters
    fetchTrialLessons();
    // Update URL params
    updateUrlParams();
  },
  { deep: true }
);
</script>
