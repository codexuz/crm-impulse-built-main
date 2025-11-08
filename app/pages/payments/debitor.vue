<template>
  <div class="container py-10 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Debitor Students</h1>
        <p class="text-muted-foreground">
          Students with overdue payments that require attention
        </p>
      </div>
      <Button variant="outline" @click="refreshData">
        <Icon name="lucide:refresh-cw" class="mr-2 h-4 w-4" />
        Refresh
      </Button>
    </div>

    <!-- Stats Overview -->
    <div class="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Total Debitors</CardTitle>
          <Icon name="lucide:users" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ debitorCount }}</div>
          <p class="text-xs text-muted-foreground">
            Students with overdue payments
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Total Overdue</CardTitle>
          <Icon name="lucide:banknote" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ formatCurrency(totalOverdueAmount) }}
          </div>
          <p class="text-xs text-muted-foreground">Outstanding payments</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Average Days</CardTitle>
          <Icon name="lucide:clock" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ averageDaysOverdue }}</div>
          <p class="text-xs text-muted-foreground">Average days overdue</p>
        </CardContent>
      </Card>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4">
      <Input
        v-model="searchQuery"
        placeholder="Search by student name..."
        class="sm:max-w-xs"
      >
        <template #leading>
          <Icon name="lucide:search" class="h-4 w-4" />
        </template>
      </Input>
      <div class="flex flex-wrap gap-2 sm:ml-auto">
        <Button variant="outline" @click="exportToCSV">
          <Icon name="lucide:download" class="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>

    <!-- Debitor Students Table -->
    <Card>
      <CardContent class="p-0">
        <div class="p-2 border-b">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Amount Due</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Next Payment Date</TableHead>
                <TableHead>Days Overdue</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-if="loading">
                <TableCell colspan="7" class="text-center py-10">
                  <Spinner class="mx-auto" />
                </TableCell>
              </TableRow>
              <TableRow v-else-if="filteredDebitors.length === 0">
                <TableCell colspan="7" class="text-center py-10">
                  <div class="flex justify-center">
                    <Icon
                      name="lucide:search-x"
                      class="h-8 w-8 text-muted-foreground"
                    />
                  </div>
                  <p class="text-muted-foreground mt-2">
                    No debitor students found
                  </p>
                </TableCell>
              </TableRow>
              <TableRow
                v-for="debitor in paginatedDebitors"
                :key="debitor.id"
                class="hover:bg-muted/50"
              >
                <TableCell>
                  <div class="font-medium">{{ debitor.student_name }}</div>
                </TableCell>
                <TableCell>{{ formatCurrency(debitor.amount) }}</TableCell>
                <TableCell>{{ formatDate(debitor.payment_date) }}</TableCell>
                <TableCell>{{
                  formatDate(debitor.next_payment_date)
                }}</TableCell>
                <TableCell>
                  <Badge
                    :variant="getOverdueBadgeVariant(debitor.days_overdue)"
                  >
                    {{ debitor.days_overdue }} days
                  </Badge>
                </TableCell>
                <TableCell class="max-w-[200px] truncate">{{
                  debitor.notes || "No notes"
                }}</TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      @click="markAsPaid(debitor)"
                      title="Mark as Paid"
                    >
                      <Icon
                        name="lucide:check-circle"
                        class="h-4 w-4 text-green-500"
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      @click="sendReminder(debitor)"
                      title="Send Payment Reminder"
                    >
                      <Icon name="lucide:mail" class="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between p-4">
          <div class="text-sm text-muted-foreground">
            Showing <span class="font-medium">{{ paginationStart }}</span> to
            <span class="font-medium">{{ paginationEnd }}</span> of
            <span class="font-medium">{{ filteredDebitors.length }}</span>
            debitors
          </div>

          <Pagination
            v-model:page="currentPage"
            :total="filteredDebitors.length"
            :items-per-page="itemsPerPage"
            :sibling-count="1"
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

    <!-- Mark as Paid Dialog -->
    <Dialog v-model:open="showPaymentDialog">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Record payment for {{ selectedDebitor?.student_name }}
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="amount" class="text-right">Amount</Label>
            <div class="col-span-3">
              <Input
                id="amount"
                v-model="paymentDetails.amount"
                type="number"
                :placeholder="
                  selectedDebitor ? String(selectedDebitor.amount) : '0'
                "
              />
            </div>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="payment-method" class="text-right"
              >Payment Method</Label
            >
            <div class="col-span-3">
              <Select v-model="paymentDetails.method">
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Naqd">Cash (Naqd)</SelectItem>
                  <SelectItem value="Karta">Card (Karta)</SelectItem>
                  <SelectItem value="Bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="notes" class="text-right">Notes</Label>
            <Textarea
              id="notes"
              v-model="paymentDetails.notes"
              placeholder="Add payment notes"
              class="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showPaymentDialog = false"
            >Cancel</Button
          >
          <Button @click="confirmPayment" :disabled="isProcessingPayment">
            <Icon
              v-if="isProcessingPayment"
              name="lucide:loader-2"
              class="mr-2 h-4 w-4 animate-spin"
            />
            {{ isProcessingPayment ? "Processing..." : "Record Payment" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Send Reminder Dialog -->
    <Dialog v-model:open="showReminderDialog">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Payment Reminder</DialogTitle>
          <DialogDescription>
            Send a payment reminder to {{ selectedDebitor?.student_name }}
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="reminder-type" class="text-right">Reminder Type</Label>
            <div class="col-span-3">
              <Select v-model="reminderDetails.type">
                <SelectTrigger id="reminder-type">
                  <SelectValue placeholder="Select reminder type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="reminder-message" class="text-right">Message</Label>
            <Textarea
              id="reminder-message"
              v-model="reminderDetails.message"
              placeholder="Enter reminder message"
              class="col-span-3"
              rows="4"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showReminderDialog = false"
            >Cancel</Button
          >
          <Button @click="confirmSendReminder" :disabled="isSendingReminder">
            <Icon
              v-if="isSendingReminder"
              name="lucide:loader-2"
              class="mr-2 h-4 w-4 animate-spin"
            />
            {{ isSendingReminder ? "Sending..." : "Send Reminder" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";
import { useToast } from "~/composables/useToast";
import { api } from "~/lib/api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

definePageMeta({
  middleware: ["auth"],
});

const { apiService } = useAuth();
const toast = useToast();
const router = useRouter();
const route = useRoute();

// State variables
const debitors = ref<any[]>([]);
const loading = ref(true);
const searchQuery = ref("");
const daysFilter = ref("all");
const currentPage = ref(1);
const itemsPerPage = 10;
const totalItems = ref(0);
const showPaymentDialog = ref(false);
const showReminderDialog = ref(false);
const selectedDebitor = ref<any>(null);
const isProcessingPayment = ref(false);
const isSendingReminder = ref(false);

// Payment form details
const paymentDetails = reactive({
  amount: 0,
  method: "Naqd",
  notes: "",
});

// Reminder form details
const reminderDetails = reactive({
  type: "sms",
  message: "",
});

// Computed properties
const debitorCount = computed(() => debitors.value.length);

const totalOverdueAmount = computed(() => {
  return debitors.value.reduce((sum, debitor) => sum + debitor.amount, 0);
});

const averageDaysOverdue = computed(() => {
  if (debitors.value.length === 0) return 0;

  const totalDays = debitors.value.reduce(
    (sum, debitor) => sum + debitor.days_overdue,
    0
  );
  return Math.round(totalDays / debitors.value.length);
});

const filteredDebitors = computed(() => {
  return debitors.value.filter((debitor) => {
    // Filter by search query
    const nameMatch = debitor.student_name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    // Filter by days overdue
    let daysMatch = true;
    if (daysFilter.value !== "all") {
      const days = debitor.days_overdue;
      switch (daysFilter.value) {
        case "0-7":
          daysMatch = days >= 0 && days <= 7;
          break;
        case "8-14":
          daysMatch = days >= 8 && days <= 14;
          break;
        case "15-30":
          daysMatch = days >= 15 && days <= 30;
          break;
        case "30+":
          daysMatch = days > 30;
          break;
      }
    }

    return nameMatch && daysMatch;
  });
});

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredDebitors.value.length / itemsPerPage));
});

const paginatedDebitors = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredDebitors.value.slice(startIndex, endIndex);
});

const paginationStart = computed(() => {
  return filteredDebitors.value.length === 0
    ? 0
    : (currentPage.value - 1) * itemsPerPage + 1;
});

const paginationEnd = computed(() => {
  return Math.min(
    currentPage.value * itemsPerPage,
    filteredDebitors.value.length
  );
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

// Fetch debitor students data
const fetchDebitors = async () => {
  loading.value = true;
  try {
    const response = await api.get<{ count: number; payments: any[] }>(
      apiService.value,
      "/student-payments/due-payments/check"
    );

    debitors.value = response.payments || [];
    totalItems.value = response.count || 0;
  } catch (error) {
    console.error("Failed to fetch debitor data:", error);
    toast.toast({
      title: "Error",
      description: "Failed to load debitor students data",
      variant: "destructive",
    });
    debitors.value = [];
    totalItems.value = 0;
  } finally {
    loading.value = false;
  }
};

// Helper functions
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
  }).format(amount);
};

const getOverdueBadgeVariant = (days: number) => {
  if (days <= 7) return "warning";
  if (days <= 14) return "default";
  if (days <= 30) return "destructive";
  return "outline"; // More than 30 days
};

// Action handlers
const refreshData = () => {
  fetchDebitors();
};

// Navigation functions for pagination
const navigatePage = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    updateUrlParams();
  }
};

const onPageChange = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    updateUrlParams();
  }
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

  if (daysFilter.value !== "all") {
    query.filter = daysFilter.value;
  }

  // Update URL with all params
  router.push({ query });
};

const markAsPaid = (debitor: any) => {
  selectedDebitor.value = debitor;
  paymentDetails.amount = debitor.amount;
  paymentDetails.notes = `Payment for overdue balance (${debitor.days_overdue} days)`;
  showPaymentDialog.value = true;
};

const confirmPayment = async () => {
  if (!selectedDebitor.value) return;

  isProcessingPayment.value = true;
  try {
    // Make API call to record payment
    await api.post(
      apiService.value,
      `/student-payments/${selectedDebitor.value.id}/record-payment`,
      {
        amount: paymentDetails.amount,
        payment_method: paymentDetails.method,
        notes: paymentDetails.notes,
      }
    );

    // Remove from local list
    debitors.value = debitors.value.filter(
      (d) => d.id !== selectedDebitor.value?.id
    );

    // Show success message
    toast.toast({
      title: "Success",
      description: `Payment recorded for ${selectedDebitor.value.student_name}`,
    });

    // Close dialog
    showPaymentDialog.value = false;
  } catch (error) {
    console.error("Failed to record payment:", error);
    toast.toast({
      title: "Error",
      description: "Failed to record payment",
      variant: "destructive",
    });
  } finally {
    isProcessingPayment.value = false;
  }
};

const viewStudentProfile = (studentId: string) => {
  window.location.href = `/students/${studentId}`;
};

const sendReminder = (debitor: any) => {
  selectedDebitor.value = debitor;

  // Pre-populate reminder message based on days overdue
  const daysText = debitor.days_overdue === 1 ? "kun" : "kun";
  reminderDetails.message = `Hurmatli ${
    debitor.student_name
  },\nSizning ${formatCurrency(debitor.amount)} miqdoridagi to'lovingiz ${
    debitor.days_overdue
  } ${daysText} ga kechikkan. Iltimos, imkon qadar tezroq to'lovni amalga oshiring.\nImpulse Study LC`;

  showReminderDialog.value = true;
};

const confirmSendReminder = async () => {
  if (!selectedDebitor.value) return;

  isSendingReminder.value = true;
  try {
    // Make API call to send reminder
    await api.post(
      apiService.value,
      `/student-payments/${selectedDebitor.value.id}/send-reminder`,
      {
        reminder_type: reminderDetails.type,
        message: reminderDetails.message,
      }
    );

    // Show success message
    toast.toast({
      title: "Success",
      description: `Reminder sent to ${selectedDebitor.value.student_name}`,
    });

    // Close dialog
    showReminderDialog.value = false;
  } catch (error) {
    console.error("Failed to send reminder:", error);
    toast.toast({
      title: "Error",
      description: "Failed to send payment reminder",
      variant: "destructive",
    });
  } finally {
    isSendingReminder.value = false;
  }
};

const exportToCSV = () => {
  // Create CSV content
  const headers = [
    "Student Name",
    "Amount Due",
    "Payment Date",
    "Days Overdue",
    "Notes",
  ];
  const rows = filteredDebitors.value.map((debitor) => [
    debitor.student_name,
    debitor.amount,
    formatDate(debitor.payment_date),
    debitor.days_overdue,
    debitor.notes || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  // Create download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `debitor-students-${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast.toast({
    title: "Success",
    description: `Exported ${filteredDebitors.value.length} debitor records`,
  });
};

// Initialize data on component mount
onMounted(() => {
  // Get URL parameters if available

  // Get page parameter
  if (route.query.page) {
    currentPage.value = parseInt(route.query.page as string, 10);
  }

  // Get search parameter
  if (route.query.search) {
    searchQuery.value = route.query.search as string;
  }

  // Get filter parameter
  if (route.query.filter) {
    daysFilter.value = route.query.filter as string;
  }

  fetchDebitors();
});

// Watch for filter changes and reset to page 1
watch([searchQuery, daysFilter], () => {
  // Reset to page 1 when filters change
  currentPage.value = 1;
  // Update URL params
  updateUrlParams();
});
</script>
