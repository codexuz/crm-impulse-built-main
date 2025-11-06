<template>
  <div>
    <!-- Dashboard Overview -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Jami talabalar</CardTitle>
          <Icon name="lucide:users" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ dashboard.totalStudents }}</div>
          <p class="text-xs text-muted-foreground">
            +{{ dashboard.newStudents }} yangi bu oyda
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Faol guruhlar</CardTitle>
          <Icon
            name="lucide:users-2"
            class="h-4 w-4 text-muted-foreground"
          />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ dashboard.activeGroups }}</div>
          <p class="text-xs text-muted-foreground">
            +{{ dashboard.recentGroups }} yangi bu oyda
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Yaqinlashayotgan to'lovlar</CardTitle>
          <Icon
            name="lucide:alert-circle"
            class="h-4 w-4 text-muted-foreground"
          />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ upcomingPayments.length }}
          </div>
          <p class="text-xs text-muted-foreground">
            {{ formatCurrency(dashboard.pendingPaymentsAmount) }} kutilmoqda
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Yangi leadlar</CardTitle>
          <Icon name="lucide:user-plus" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ dashboard.newLeads }}</div>
          <p class="text-xs text-muted-foreground">
            {{ dashboard.leadsConverted }} talabalarga aylantirildi
          </p>
        </CardContent>
      </Card>
    </div>


    <!-- Lesson Schedules Section -->
    <div class="grid gap-4 grid-cols-1 mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Dars jadvallari</CardTitle>
          <CardDescription>Barcha rejalashtirilgan darslarni ko'rish</CardDescription>
          <div class="flex items-center space-x-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              class="h-8"
              :class="
                dashboard.calendarView === 'day'
                  ? 'bg-primary text-primary-foreground'
                  : ''
              "
              @click="dashboard.calendarView = 'day'"
            >
              Kun
            </Button>
            <Button
              variant="outline"
              size="sm"
              class="h-8"
              :class="
                dashboard.calendarView === 'week'
                  ? 'bg-primary text-primary-foreground'
                  : ''
              "
              @click="dashboard.calendarView = 'week'"
            >
              Hafta
            </Button>
            <Button
              variant="outline"
              size="sm"
              class="h-8"
              :class="
                dashboard.calendarView === 'month'
                  ? 'bg-primary text-primary-foreground'
                  : ''
              "
              @click="dashboard.calendarView = 'month'"
            >
              Oy
            </Button>
            <div class="ml-auto flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                class="h-8"
                @click="navigatePrevious"
              >
                <Icon name="lucide:chevron-left" class="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                class="h-8"
                @click="navigateToday"
              >
                Bugun
              </Button>
              <Button
                variant="outline"
                size="sm"
                class="h-8"
                @click="navigateNext"
              >
                <Icon name="lucide:chevron-right" class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="calendar-container">
            <!-- Calendar Header -->
            <div class="grid grid-cols-7 gap-1 mb-2">
              <template
                v-if="
                  dashboard.calendarView === 'week' ||
                  dashboard.calendarView === 'month'
                "
              >
                <div
                  v-for="day in [
                    'Yak',
                    'Dush',
                    'Sesh',
                    'Chor',
                    'Pay',
                    'Jum',
                    'Shan',
                  ]"
                  class="text-center font-medium text-sm py-2"
                >
                  {{ day }}
                </div>
              </template>
              <template v-else>
                <div class="col-span-7 text-center font-medium">
                  {{ formatCalendarDate(dashboard.currentDate) }}
                </div>
              </template>
            </div>

            <!-- Calendar Body -->
            <div
              v-if="dashboard.calendarView === 'month'"
              class="grid grid-cols-7 gap-1 h-[400px]"
            >
              <template v-for="(day, index) in calendarDays" :key="index">
                <div
                  class="border rounded p-1 h-full overflow-auto"
                  :class="
                    isCurrentDay(day) ? 'bg-primary/10 border-primary' : ''
                  "
                >
                  <div class="text-right text-xs mb-1">{{ day.getDate() }}</div>
                  <div
                    v-for="lesson in getLessonsForDay(day)"
                    :key="lesson.id"
                    class="mb-1 p-1 text-xs rounded bg-primary/20 cursor-pointer"
                    @click="showLessonDetails(lesson)"
                  >
                    {{ formatTime(lesson.startTime) }} - {{ lesson.groupName }}
                  </div>
                </div>
              </template>
            </div>

            <div
              v-else-if="dashboard.calendarView === 'week'"
              class="grid grid-cols-7 gap-1"
            >
              <template v-for="(day, index) in weekDays" :key="index">
                <div
                  class="border rounded p-1 h-[400px] overflow-auto"
                  :class="
                    isCurrentDay(day) ? 'bg-primary/10 border-primary' : ''
                  "
                >
                  <div class="text-center text-xs mb-2 font-medium">
                    {{ formatDate(day) }}
                  </div>
                  <div
                    v-for="lesson in getLessonsForDay(day)"
                    :key="lesson.id"
                    class="mb-1 p-2 text-xs rounded bg-primary/20 cursor-pointer"
                    @click="showLessonDetails(lesson)"
                  >
                    <div class="font-bold">
                      {{ formatTime(lesson.startTime) }} -
                      {{ formatTime(lesson.endTime) }}
                    </div>
                    <div>{{ lesson.groupName }}</div>
                    <div class="text-xs text-muted-foreground">
                      {{ lesson.teacherName }}
                    </div>
                    <div class="text-xs text-muted-foreground">
                      Xona: {{ lesson.roomNumber }}
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <div v-else class="border rounded p-2 h-[400px] overflow-auto">
              <div
                v-for="hour in Array.from({ length: 15 }, (_, i) => i + 8)"
                :key="hour"
                class="relative h-12 border-b"
              >
                <div class="absolute left-0 text-xs text-muted-foreground">
                  {{ formatHour(hour) }}
                </div>
                <div
                  v-for="lesson in getLessonsForHour(
                    dashboard.currentDate,
                    hour
                  )"
                  :key="lesson.id"
                  class="absolute left-16 right-0 rounded px-2 py-1 bg-primary/20 cursor-pointer"
                  :style="getLessonPositionStyle(lesson, hour)"
                  @click="showLessonDetails(lesson)"
                >
                  <div class="font-bold text-xs">{{ lesson.groupName }}</div>
                  <div class="text-xs">
                    {{ formatTime(lesson.startTime) }} -
                    {{ formatTime(lesson.endTime) }}
                  </div>
                  <div class="text-xs">{{ lesson.teacherName }}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Leads and Lesson Schedules -->
    <div class="grid gap-4 grid-cols-1 mt-4">
      <Card>
        <CardHeader>
          <CardTitle>So'nggi leadlar</CardTitle>
          <CardDescription>Eng yangi potentsial talabalar</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="(lead, index) in dashboard.recentLeads"
              :key="index"
              class="flex items-start"
            >
              <div class="mr-4 rounded-full bg-primary/10 p-2">
                <Icon name="lucide:user" class="h-4 w-4 text-primary" />
              </div>
              <div>
                <p class="text-sm font-medium">{{ lead.name }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ lead.phone }} | {{ lead.source }}
                </p>
                <p class="text-xs text-muted-foreground mt-1">
                  {{ lead.question ? `Savol: ${lead.question}` : "" }}
                </p>
                <p class="text-xs text-muted-foreground">
                  Holat: {{ lead.status }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Quick Actions -->
    <div class="mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Tezkor harakatlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              class="h-9"
              @click="navigateTo('/students')"
            >
              <Icon name="lucide:user-plus" class="mr-2 h-4 w-4" />
              Talaba qo'shish
            </Button>
            <Button
              variant="outline"
              size="sm"
              class="h-9"
              @click="navigateTo('/teachers')"
            >
              <Icon name="lucide:user-cog" class="mr-2 h-4 w-4" />
              O'qituvchi qo'shish
            </Button>
            <Button
              variant="outline"
              size="sm"
              class="h-9"
              @click="navigateTo('/groups')"
            >
              <Icon name="lucide:users" class="mr-2 h-4 w-4" />
              Guruh yaratish
            </Button>
            <Button
              variant="outline"
              size="sm"
              class="h-9"
              @click="navigateTo('/courses')"
            >
              <Icon name="lucide:book" class="mr-2 h-4 w-4" />
              Kurs qo'shish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useAuth } from "~/composables/useAuth";
import { api } from "~/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

definePageMeta({
  middleware: ["auth"],
});

const { apiService } = useAuth();

// Reactive dashboard data
const dashboard = reactive({
  totalStudents: 0,
  newStudents: 0,
  activeGroups: 0,
  recentGroups: 0,
  pendingPaymentsAmount: 0,
  newLeads: 0,
  leadsConverted: 0,
  recentLeads: [] as any[],
  lessonSchedules: [] as any[],
  currentDate: new Date(),
  calendarView: "day" as "day" | "week" | "month",
});

// Reactive state for debitor students
const debitorStudents = ref<any[]>([]);

// Reactive state for upcoming payments
const upcomingPayments = ref<any[]>([]);

// Fetch dashboard data from API
const fetchDashboardData = async () => {
  try {
    // Get student stats
    try {
      const students = await api.get<any[]>(
        apiService.value,
        "/users/students"
      );
      dashboard.totalStudents = students.length;

      // Calculate new students (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dashboard.newStudents = students.filter(
        (s) => new Date(s.created_at) > thirtyDaysAgo
      ).length;
    } catch (studentError) {
      console.error("Failed to fetch student data:", studentError);
      dashboard.totalStudents = 0;
      dashboard.newStudents = 0;
    }

    // Get group stats
    let groups = [];
    try {
      const groupCountResponse = await api.get<{ count: number }>(
        apiService.value,
        "/groups/group-count"
      );
      dashboard.activeGroups = groupCountResponse.count || 0;

      // Get groups for recent groups calculation
      groups = await api.get<any[]>(apiService.value, "/groups");
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dashboard.recentGroups = groups.filter(
        (g) => new Date(g.createdAt) > thirtyDaysAgo
      ).length;
    } catch (groupError) {
      console.error("Failed to fetch group data:", groupError);
      dashboard.activeGroups = 0;
      dashboard.recentGroups = 0;
    }

    // Get upcoming payments data
    try {
      const upcomingResponse = await api.get<any[]>(
        apiService.value,
        "/student-payments/upcoming?days=7"
      );

      upcomingPayments.value = upcomingResponse || [];

      // Calculate total pending amount
      dashboard.pendingPaymentsAmount = upcomingPayments.value.reduce(
        (total, payment) => total + (payment.amount || 0),
        0
      );
    } catch (upcomingError) {
      console.error("Failed to fetch upcoming payments:", upcomingError);
      upcomingPayments.value = [];
      dashboard.pendingPaymentsAmount = 0;
    }

    // Get leads data
    try {
      const leadsResponse = await api.get<{ leads: any[]; total: number }>(
        apiService.value,
        "/leads?limit=1000"
      );
      const leads = leadsResponse.leads || [];
      dashboard.newLeads = leads.length;
      dashboard.leadsConverted = leads.filter(
        (l) =>
          l.status === "O'qishga yozildi" || l.status === "O'qishga yozildi"
      ).length;

      // Get recent leads (up to 5)
      dashboard.recentLeads = leads
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
        .map((lead) => ({
          name: `${lead.first_name} ${lead.last_name}`,
          phone: lead.phone,
          question: lead.question,
          status: lead.status,
          source: lead.source,
        }));
    } catch (leadsError) {
      console.error("Failed to fetch leads data:", leadsError);
      dashboard.newLeads = 0;
      dashboard.leadsConverted = 0;
      dashboard.recentLeads = [];
    }

    // Get lesson schedules
    try {
      const lessonSchedules = await api.get<any[]>(
        apiService.value,
        "/lesson-schedules"
      );

      // Process lesson schedules for the calendar view
      dashboard.lessonSchedules = lessonSchedules.map((lesson) => {
        // Parse dates using the Uzbekistan timezone
        const startTime = new Date(lesson.start_time);
        const endTime = new Date(lesson.end_time);

        return {
          id: lesson.id,
          groupName: lesson.group?.name || "Unknown Group",
          roomNumber: lesson.room_number,
          dayTime: lesson.day_time, // odd/even days
          startTime,
          endTime,
          teacherName:
            `${lesson.group?.teacher?.first_name || ""} ${
              lesson.group?.teacher?.last_name || ""
            }`.trim() || "Unknown Teacher",
        };
      });
    } catch (scheduleError) {
      console.error("Failed to fetch lesson schedules:", scheduleError);
      dashboard.lessonSchedules = [];
    }
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
  }
};

// Helper functions
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "Asia/Tashkent",
  }).format(date);
};

const formatDatetime = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tashkent",
  }).format(date);
};

const formatCalendarDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Tashkent",
  }).format(date);
};

const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tashkent",
  }).format(date);
};

const formatHour = (hour: number): string => {
  return `${hour.toString().padStart(2, "0")}:00`;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatSimpleDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Tashkent",
  }).format(date);
};

// Calendar navigation functions
const navigatePrevious = () => {
  const current = new Date(dashboard.currentDate);
  if (dashboard.calendarView === "day") {
    dashboard.currentDate = addDays(current, -1);
  } else if (dashboard.calendarView === "week") {
    dashboard.currentDate = addDays(current, -7);
  } else {
    const newDate = new Date(current);
    newDate.setMonth(current.getMonth() - 1);
    dashboard.currentDate = newDate;
  }
};

const navigateNext = () => {
  const current = new Date(dashboard.currentDate);
  if (dashboard.calendarView === "day") {
    dashboard.currentDate = addDays(current, 1);
  } else if (dashboard.calendarView === "week") {
    dashboard.currentDate = addDays(current, 7);
  } else {
    const newDate = new Date(current);
    newDate.setMonth(current.getMonth() + 1);
    dashboard.currentDate = newDate;
  }
};

const navigateToday = () => {
  dashboard.currentDate = new Date();
};

// Calendar utility functions
const isCurrentDay = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

// Calendar data computed properties
const weekDays = computed(() => {
  const date = new Date(dashboard.currentDate);
  const day = date.getDay();

  // Set to beginning of week (Sunday)
  date.setDate(date.getDate() - day);

  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
});

const calendarDays = computed(() => {
  const date = new Date(
    dashboard.currentDate.getFullYear(),
    dashboard.currentDate.getMonth(),
    1
  );
  const days = [];

  // Get to the first Sunday before or on the 1st of the month
  while (date.getDay() !== 0) {
    date.setDate(date.getDate() - 1);
  }

  // Generate 6 weeks of days (42 days)
  for (let i = 0; i < 42; i++) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
});

// Get lessons for a specific day
const getLessonsForDay = (day: Date) => {
  return dashboard.lessonSchedules.filter((lesson) =>
    isSameDay(new Date(lesson.startTime), day)
  );
};

// Get lessons for a specific hour
const getLessonsForHour = (day: Date, hour: number) => {
  return dashboard.lessonSchedules.filter((lesson) => {
    const lessonDate = new Date(lesson.startTime);
    return isSameDay(lessonDate, day) && lessonDate.getHours() === hour;
  });
};

// Get position and height for a lesson in day view
const getLessonPositionStyle = (lesson: any, hour: number) => {
  const startTime = new Date(lesson.startTime);
  const endTime = new Date(lesson.endTime);

  const minuteOffset = (startTime.getMinutes() / 60) * 100;
  const durationMinutes =
    (endTime.getTime() - startTime.getTime()) / (1000 * 60);
  const heightPercentage = (durationMinutes / 60) * 100;

  return {
    top: `${minuteOffset}%`,
    height: `${heightPercentage}%`,
  };
};

// Show lesson details in a modal or popup
const showLessonDetails = (lesson: any) => {
  // In a real app, you would show a modal or popup with details
  console.log("Lesson details:", lesson);
  // For now, we'll just use an alert
  alert(`
    Group: ${lesson.groupName}
    Teacher: ${lesson.teacherName}
    Room: ${lesson.roomNumber}
    Time: ${formatTime(lesson.startTime)} - ${formatTime(lesson.endTime)}
    Day type: ${lesson.dayTime}
  `);
};

// Navigation helper
const navigateTo = (path: string) => {
  window.location.href = path;
};

// Fetch data on component mount
onMounted(() => {
  fetchDashboardData();
});
</script>
