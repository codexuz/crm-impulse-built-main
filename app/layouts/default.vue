<template>
  <SidebarProvider class="flex min-h-screen">
    <!-- Sidebar -->
    <Sidebar>
      <SidebarHeader>
        <div class="p-4">
          <h2 class="text-xl font-bold">Impulse Study CRM</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NuxtLink to="/">
                  <Icon name="lucide:layout-dashboard" />
                  <span>Boshqaruv paneli</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Marketing</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen class="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Icon name="lucide:users-round" />
                      <span>Lead boshqaruvi</span>
                      <Icon name="lucide:chevron-down" class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <NuxtLink to="/leads">
                            Leadlar
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <NuxtLink to="/leads/lead-trials">
                            Sinov darslari
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Foydalanuvchilar</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu class="space-y-2">
              <Collapsible defaultOpen class="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Icon name="lucide:graduation-cap" />
                      <span>Talabalar boshqaruvi</span>
                      <Icon name="lucide:chevron-down" class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <NuxtLink to="/students">
                            Faol talabalar
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <NuxtLink to="/students/archive">
                            Arxiv talabalar
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              
              <Collapsible defaultOpen class="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Icon name="lucide:users" />
                      <span>O'qituvchilar boshqaruvi</span>
                      <Icon name="lucide:chevron-down" class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <NuxtLink to="/teachers">
                            O'qituvchilar
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem v-if="hasFinancialAccess">
                        <SidebarMenuSubButton asChild>
                          <NuxtLink to="/teachers/profile">
                            O'qituvchi profili
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NuxtLink to="/groups">
                    <Icon name="lucide:users-2" />
                    <span>Guruhlar</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Darslar boshqaruvi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NuxtLink to="/courses">
                    <Icon name="lucide:book-open" />
                    <span>Kurslar</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NuxtLink to="/attendance">
                    <Icon name="lucide:calendar-check" />
                    <span>Davomat</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NuxtLink to="/schedules">
                    <Icon name="lucide:calendar" />
                    <span>Jadvallar</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NuxtLink to="/cd-ielts">
                    <Icon name="lucide:file-text" />
                    <span>CD IELTS</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Moliya</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu class="space-y-2">
              <Collapsible defaultOpen class="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Icon name="lucide:credit-card" />
                      <span>To'lovlar</span>
                      <Icon name="lucide:chevron-down" class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <NuxtLink to="/payments">
                            Qilingan to'lovlar
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <NuxtLink to="/payments/upcoming">
                            Kelayotgan to'lovlar
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <NuxtLink to="/payments/debitor">
                            Qarzdorlar
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              
              <Collapsible v-if="hasFinancialAccess" defaultOpen class="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Icon name="lucide:receipt" />
                      <span>Xarajatlar</span>
                      <Icon name="lucide:chevron-down" class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <NuxtLink to="/expenses">
                            <Icon name="lucide:coins" />
                            Barcha xarajatlar
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem> <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NuxtLink to="/expenses/categories">
                          <Icon name="lucide:tags" />
                          <span>Xarajatlar kategoriyasi</span>
                        </NuxtLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

             

              <Collapsible v-if="hasFinancialAccess" defaultOpen class="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Icon name="lucide:banknote" />
                      <span>Oylik maoshlar</span>
                      <Icon name="lucide:chevron-down" class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <NuxtLink to="/salaries/calculate">
                            Maosh hisoblash
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <NuxtLink to="/salaries/history">
                            To'lov tarixi
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter>
        <div class="p-4 border-t"></div>
      </SidebarFooter>
    </Sidebar>

    <SidebarInset>
      <!-- Main content -->
      <main class="flex-1 overflow-y-auto">
        <div class="flex flex-col h-full">
          <!-- Header -->
          <header class="sticky top-0 z-10 border-b bg-background">
            <div class="flex items-center justify-between p-4">
              <div class="flex items-center">
                <SidebarTrigger class="mx-1" />
                <div class="lg:hidden w-8"></div>
                <h1 class="text-xl font-semibold">{{ pageTitle }}</h1>
              </div>
              <div class="flex items-center space-x-2">
                <ModeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon">
                      <Icon name="lucide:user" class="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Mening hisobim</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click="$router.push('/profile')">
                      <Icon name="lucide:user" class="w-4 h-4 mr-2" />
                      Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="handleLogout">
                      <Icon name="lucide:log-out" class="w-4 h-4 mr-2" />
                      Chiqish
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <!-- Page content -->
          <div class="flex-1 p-4">
            <Toaster />
            <slot />
          </div>
        </div>
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useAuth } from "~/composables/useAuth";
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css"; // vue-sonner v2 requires this import

const route = useRoute();
const { logout, auth } = useAuth();
const { toast } = useToast();

// Check if user has access to financial features
const hasFinancialAccess = computed(() => {
  return auth.value?.user?.id === "d6bd8680-ca59-438c-95ed-ba363a86a065" || auth.value?.user?.phone === "+998900064400";
});

// Compute page title based on route
const pageTitle = computed(() => {
  const path = route.path;
  if (path === "/") return "Boshqaruv paneli";
  const segments = path.split("/").filter(Boolean);
  if (segments.length > 0 && segments[0]) {
    const pageTitles: Record<string, string> = {
      students: "Talabalar",
      teachers: "O'qituvchilar",
      groups: "Guruhlar",
      courses: "Kurslar",
      schedules: "Jadvallar",
      attendance: "Davomat",
      payments: "To'lovlar",
      leads: "Leadlar",
      profile: "Profil",
      lessons: "Darslar",
      expenses: "Xarajatlar",
      "expense-categories": "Xarajatlar kategoriyasi",
      salaries: "Oylik maoshlar"
    };
    return pageTitles[segments[0]] || segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
  }
  return "Boshqaruv paneli";
});

// Handle logout
const handleLogout = async () => {
  try {
    await logout();
    toast({
      title: "Tizimdan chiqildi",
      description: "Siz muvaffaqiyatli tizimdan chiqdingiz",
    });
    navigateTo("/login");
  } catch (error) {
    console.error("Error logging out:", error);
    toast({
      title: "Xatolik",
      description: "Tizimdan chiqishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
      variant: "destructive",
    });
  }
};
</script>
