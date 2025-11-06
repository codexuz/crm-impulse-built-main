<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Lead boshqaruvi</h2>
        <p class="text-muted-foreground">
          Potentsial talaba leadlarini kuzatish va boshqarish
        </p>
      </div>
      <Dialog>
        <DialogTrigger as-child>
          <Button>
            <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
            Yangi lead qo'shish
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Yangi lead yaratish</DialogTitle>
            <DialogDescription>
              Tizimga yangi potentsial talaba qo'shish
            </DialogDescription>
          </DialogHeader>
          <form @submit.prevent="createLead">
            <div class="grid gap-4 py-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Label for="first_name">Ism</Label>
                  <Input
                    id="first_name"
                    v-model="newLead.first_name"
                    class="mt-1"
                  />
                </div>
                <div>
                  <Label for="last_name">Familiya</Label>
                  <Input
                    id="last_name"
                    v-model="newLead.last_name"
                    class="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label for="phone">Telefon raqami</Label>
                <Input id="phone" v-model="newLead.phone" class="mt-1" />
              </div>

              <div>
                <Label for="question">So'rov/Savol</Label>
                <Textarea
                  id="question"
                  v-model="newLead.question"
                  class="mt-1"
                  rows="3"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Label for="status">Holat</Label>
                  <Select v-model="newLead.status" class="mt-1 w-full">
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Holatni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yangi">Yangi</SelectItem>
                      <SelectItem value="Aloqada">Aloqada</SelectItem>
                      <SelectItem value="Sinovda">Sinovda</SelectItem>
                      <SelectItem value="Sinovda qatnashdi"
                        >Sinovda qatnashdi</SelectItem
                      >
                      <SelectItem value="O'qishga yozildi">O'qishga yozildi</SelectItem>
                      <SelectItem value="Yo'qotildi">Yo'qotildi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label for="source">Lead manbai</Label>
                  <Select v-model="newLead.source" class="mt-1 w-full">
                    <SelectTrigger id="source">
                      <SelectValue placeholder="Manbani tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Telegram">Telegram</SelectItem>
                      <SelectItem value="Do'stimdan">Do'stimdan</SelectItem>
                      <SelectItem value="O'zim keldim">O'zim keldim</SelectItem>
                      <SelectItem value="Flayer">Flayer</SelectItem>
                      <SelectItem value="Banner(yondagi)"
                        >Banner(yondagi)</SelectItem
                      >
                      <SelectItem value="Banner(ko'chadagi)"
                        >Banner(ko'chadagi)</SelectItem
                      >
                      <SelectItem value="Boshqa">Boshqa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label for="course_id">Qiziqish bildirgan kurs</Label>
                <Select v-model="newLead.course_id" class="mt-1 w-full">
                  <SelectTrigger id="course_id">
                    <SelectValue placeholder="Kursni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
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

              <div>
                <Label for="notes">Qo'shimcha izohlar</Label>
                <Textarea
                  id="notes"
                  v-model="newLead.notes"
                  class="mt-1"
                  rows="3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" :disabled="isCreatingLead">
                <Icon
                  v-if="isCreatingLead"
                  name="lucide:loader-2"
                  class="mr-2 h-4 w-4 animate-spin"
                />
                {{ isCreatingLead ? "Yaratilmoqda..." : "Lead yaratish" }}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Filters and Search -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <Input v-model="search" placeholder="Leadlarni qidirish..." class="sm:max-w-xs">
        <template #leading>
          <Icon name="lucide:search" class="h-4 w-4" />
        </template>
      </Input>
      <div class="flex flex-wrap gap-2 sm:ml-auto">
        <Select v-model="filterStatus" class="w-[150px]">
          <SelectTrigger>
            <SelectValue placeholder="Holat bo'yicha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">Barcha holatlar</SelectItem>
            <SelectItem value="Yangi">Yangi</SelectItem>
            <SelectItem value="Aloqada">Aloqada</SelectItem>
            <SelectItem value="Sinovda">Sinovda</SelectItem>
            <SelectItem value="Sinovda qatnashdi">Sinovda qatnashdi</SelectItem>
            <SelectItem value="O'qishga yozildi">O'qishga yozildi</SelectItem>
            <SelectItem value="Yo'qotildi">Yo'qotildi</SelectItem>
          </SelectContent>
        </Select>

        <Select v-model="filterSource" class="w-[150px]">
          <SelectTrigger>
            <SelectValue placeholder="Manba bo'yicha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">Barcha manbalar</SelectItem>
            <SelectItem value="Instagram">Instagram</SelectItem>
            <SelectItem value="Telegram">Telegram</SelectItem>
            <SelectItem value="Do'stimdan">Do'stimdan</SelectItem>
            <SelectItem value="O'zim keldim">O'zim keldim</SelectItem>
            <SelectItem value="Flayer">Flayer</SelectItem>
            <SelectItem value="Banner(yondagi)">Banner(yondagi)</SelectItem>
            <SelectItem value="Banner(ko'chadagi)">Banner(ko'chadagi)</SelectItem>
            <SelectItem value="Boshqa">Boshqa</SelectItem>
          </SelectContent>
        </Select>

        <Select v-model="filterDate" class="w-[150px]">
          <SelectTrigger>
            <SelectValue placeholder="Sana bo'yicha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">Barcha vaqt</SelectItem>
            <SelectItem value="today">Bugun</SelectItem>
            <SelectItem value="yesterday">Kecha</SelectItem>
            <SelectItem value="week">Shu hafta</SelectItem>
            <SelectItem value="month">Shu oy</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          @click="exportLeadsToCSV"
          class="flex items-center"
        >
          <Icon name="lucide:download" class="mr-2 h-4 w-4" />
          CSV eksport
        </Button>
      </div>
    </div>

    <!-- Leads Table -->
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ism</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Holat</TableHead>
            <TableHead>Manba</TableHead>
            <TableHead>Qiziqayotgan kurs</TableHead>
            <TableHead>Yaratilgan</TableHead>
            <TableHead class="text-right">Amallar</TableHead>
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
              <p class="text-muted-foreground mt-2">Leadlar yuklanmoqda...</p>
            </TableCell>
          </TableRow>
          <TableRow v-else-if="filteredLeads.length === 0">
            <TableCell colspan="7" class="text-center py-10">
              <div class="flex justify-center">
                <Icon
                  name="lucide:user-x"
                  class="h-8 w-8 text-muted-foreground"
                />
              </div>
              <p class="text-muted-foreground mt-2">Leadlar topilmadi</p>
              <Button variant="link" @click="refreshLeads" class="mt-2">
                Ma'lumotlarni yangilash
              </Button>
            </TableCell>
          </TableRow>
          <TableRow v-for="lead in filteredLeads" :key="lead.id">
            <TableCell>
              <div>
                <div class="font-medium">
                  {{ lead.first_name }} {{ lead.last_name }}
                </div>
                <div class="text-xs text-muted-foreground">
                  ID: {{ lead.id }}
                </div>
              </div>
            </TableCell>
            <TableCell>{{ lead.phone }}</TableCell>
            <TableCell>
              <Badge :variant="getStatusVariant(lead.status)">
                {{ getStatusDisplay(lead.status) }}
              </Badge>
            </TableCell>
            <TableCell>{{ getSourceDisplay(lead.source) }}</TableCell>
            <TableCell>{{ getCourseTitle(lead.course_id) }}</TableCell>
            <TableCell>{{ formatDate(lead.createdAt) }}</TableCell>
            <TableCell>
              <div class="flex items-center justify-end gap-2">
                <Button variant="ghost" size="icon" @click="viewLead(lead)">
                  <Icon name="lucide:eye" class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" @click="editLead(lead)">
                  <Icon name="lucide:pencil" class="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon">
                      <Icon name="lucide:more-vertical" class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="changeLeadStatus(lead)">
                      <Icon name="lucide:refresh-cw" class="mr-2 h-4 w-4" />
                      Holatni o'zgartirish
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="scheduleTrialLesson(lead)">
                      <Icon name="lucide:calendar-plus" class="mr-2 h-4 w-4" />
                      Sinov darsini rejalashtirish
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="convertToStudent(lead)">
                      <Icon name="lucide:user-plus" class="mr-2 h-4 w-4" />
                      Talabaga aylantirish
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      @click="confirmDeleteLead(lead)"
                      class="text-destructive focus:text-destructive"
                    >
                      <Icon name="lucide:trash-2" class="mr-2 h-4 w-4" />
                      O'chirish
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
    <div class="flex items-center justify-between py-4">
      <div class="text-sm text-muted-foreground">
        <span class="font-medium">{{ paginationStart }}</span> dan
        <span class="font-medium">{{ paginationEnd }}</span> gacha,
        jami <span class="font-medium">{{ totalLeads }}</span> lead
      </div>

      <Pagination
        :items-per-page="itemsPerPage"
        :total="totalLeads"
        :default-page="currentPage"
        @update:page="onPageChange"
      >
        <PaginationContent>
          <PaginationPrevious
            :disabled="currentPage === 1"
            @click="navigatePage(currentPage - 1)"
          />

          <PaginationItem
            v-for="page in displayedPages"
            :key="page"
            :value="page"
            :is-active="page === currentPage"
            @click="navigatePage(page)"
          >
            {{ page }}
          </PaginationItem>

          <PaginationEllipsis v-if="showEndEllipsis" />

          <PaginationNext
            :disabled="currentPage === totalPages"
            @click="navigatePage(currentPage + 1)"
          />
        </PaginationContent>
      </Pagination>
    </div>

    <!-- View Lead Dialog -->
    <Dialog v-model:open="viewLeadDialog">
      <DialogContent class="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Lead ma'lumotlari</DialogTitle>
          <DialogDescription>
            Lead haqida batafsil ma'lumot
          </DialogDescription>
        </DialogHeader>
        <div v-if="selectedLead" class="py-4">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold">
                {{ selectedLead.first_name }} {{ selectedLead.last_name }}
              </h3>
              <Badge
                :variant="getStatusVariant(selectedLead.status)"
                class="mt-2"
              >
                {{ getStatusDisplay(selectedLead.status) }}
              </Badge>
            </div>
            <div class="text-sm">
              <div class="font-medium">Yaratilgan</div>
              <div class="text-muted-foreground">
                {{ formatDate(selectedLead.createdAt) }}
              </div>
            </div>
          </div>

          <Separator class="my-4" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 class="text-sm font-medium">Aloqa ma'lumotlari</h4>
              <div class="mt-2 space-y-2">
                <div class="flex items-center gap-2">
                  <Icon
                    name="lucide:phone"
                    class="h-4 w-4 text-muted-foreground"
                  />
                  <span>{{ selectedLead.phone }}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium">Lead manbai</h4>
              <div class="mt-2">
                <Badge variant="outline">{{
                  getSourceDisplay(selectedLead.source)
                }}</Badge>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <h4 class="text-sm font-medium">So'rov/Savol</h4>
            <p class="mt-2 p-3 bg-muted rounded-md">
              {{ selectedLead.question }}
            </p>
          </div>

          <div class="mb-4">
            <h4 class="text-sm font-medium">Qiziqayotgan kurs</h4>
            <p class="mt-2">{{ getCourseTitle(selectedLead.course_id) }}</p>
          </div>

          <div v-if="selectedLead.notes" class="mb-4">
            <h4 class="text-sm font-medium">Qo'shimcha izohlar</h4>
            <p class="mt-2 p-3 bg-muted rounded-md">{{ selectedLead.notes }}</p>
          </div>

          <div v-if="leadTrialLessons.length > 0">
            <h4 class="text-sm font-medium">Sinov darslari</h4>
            <div class="mt-2 border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sana va vaqt</TableHead>
                    <TableHead>O'qituvchi</TableHead>
                    <TableHead>Holat</TableHead>
                    <TableHead>Izohlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="trial in leadTrialLessons" :key="trial.id">
                    <TableCell>{{
                      formatDateTime(trial.scheduledAt)
                    }}</TableCell>
                    <TableCell>{{
                      getTeacherName(trial.teacher_id)
                    }}</TableCell>
                    <TableCell>
                      <Badge :variant="getTrialStatusVariant(trial.status)">
                        {{ getTrialStatusDisplay(trial.status) }}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div class="max-w-[200px] truncate" :title="trial.notes">
                        {{ trial.notes }}
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="viewLeadDialog = false"
            >Yopish</Button
          >
          <Button @click="selectedLead && scheduleTrialLesson(selectedLead)"
            >Sinov darsini rejalashtirish</Button
          >
          <Button
            variant="default"
            class="bg-green-600 hover:bg-green-700"
            @click="selectedLead && convertToStudent(selectedLead)"
          >
            <Icon name="lucide:user-plus" class="mr-2 h-4 w-4" />
            Talabaga aylantirish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Change Status Dialog -->
    <Dialog v-model:open="changeStatusDialog">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lead holatini o'zgartirish</DialogTitle>
          <DialogDescription>
            {{ selectedLead?.first_name }}
            {{ selectedLead?.last_name }} holatini yangilash
          </DialogDescription>
        </DialogHeader>
        <div class="py-4">
          <RadioGroup v-model="newLeadStatus" class="space-y-4">
            <div
              v-for="status in leadStatuses"
              :key="status.value"
              class="flex items-center space-x-2"
            >
              <RadioGroupItem :value="status.value" :id="status.value" />
              <Label
                :for="status.value"
                class="flex items-center cursor-pointer"
              >
                <Badge :variant="getStatusVariant(status.value)" class="mr-2">
                  {{ status.label }}
                </Badge>
                {{ status.description }}
              </Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="changeStatusDialog = false"
            >Bekor qilish</Button
          >
          <Button @click="updateLeadStatus" :disabled="isUpdating">
            <Icon
              v-if="isUpdating"
              name="lucide:loader-2"
              class="mr-2 h-4 w-4 animate-spin"
            />
            {{ isUpdating ? "Yangilanmoqda..." : "Holatni yangilash" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Schedule Trial Lesson Dialog -->
    <Dialog v-model:open="trialLessonDialog">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Sinov darsini rejalashtirish</DialogTitle>
          <DialogDescription>
            {{ selectedLead?.first_name }}
            {{ selectedLead?.last_name }} uchun sinov darsini rejalashtirish
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="saveTrialLesson">
          <div class="grid gap-4 py-4">
            <div>
              <Label for="scheduledAt">Sana va vaqt</Label>
              <div class="grid grid-cols-2 gap-4 mt-1">
                <Input
                  type="date"
                  id="scheduledDate"
                  v-model="trialLesson.scheduledDate"
                  class="w-full"
                />

                <Select v-model="trialLesson.scheduledTime">
                  <SelectTrigger>
                    <SelectValue placeholder="Vaqtni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="time in timeSlots"
                      :key="time"
                      :value="time"
                    >
                      {{ time }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label for="teacher_id">O'qituvchi</Label>
              <Select v-model="trialLesson.teacher_id" class="mt-1">
                <SelectTrigger id="teacher_id">
                  <SelectValue placeholder="O'qituvchini tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="teacher in teachers"
                    :key="teacher.user_id"
                    :value="teacher.user_id"
                  >
                    {{ teacher.first_name }} {{ teacher.last_name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label for="status">Holat</Label>
              <Select v-model="trialLesson.status" class="mt-1">
                <SelectTrigger id="status">
                  <SelectValue placeholder="Holatni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="belgilangan">Belgilangan</SelectItem>
                  <SelectItem value="keldi">Keldi</SelectItem>
                  <SelectItem value="kelmadi">Kelmadi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label for="notes">Izohlar</Label>
              <Textarea
                id="notes"
                v-model="trialLesson.notes"
                rows="3"
                class="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" @click="trialLessonDialog = false"
              >Bekor qilish</Button
            >
            <Button type="submit" :disabled="isSavingTrial">
              <Icon
                v-if="isSavingTrial"
                name="lucide:loader-2"
                class="mr-2 h-4 w-4 animate-spin"
              />
              {{ isSavingTrial ? "Saqlanmoqda..." : "Sinov darsini rejalashtirish" }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog v-model:open="deleteConfirmDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ishonchingiz komilmi?</AlertDialogTitle>
          <AlertDialogDescription>
            Bu amalni qaytarib bo'lmaydi. Lead va unga tegishli barcha ma'lumotlar butunlay o'chiriladi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
          <AlertDialogAction
            @click="deleteLead"
            class="bg-destructive text-white hover:bg-destructive/90"
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

    <!-- Convert to Student Dialog -->
    <Dialog v-model:open="convertToStudentDialog">
      <DialogContent class="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Leadni talabaga aylantirish</DialogTitle>
          <DialogDescription>
            {{ leadToConvert?.first_name }}
            {{ leadToConvert?.last_name }} uchun talaba akkaunti yaratish
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="createStudentFromLead">
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <Label for="student_first_name">Ism</Label>
                <Input
                  id="student_first_name"
                  v-model="newStudent.first_name"
                  class="mt-1"
                />
              </div>
              <div>
                <Label for="student_last_name">Familiya</Label>
                <Input
                  id="student_last_name"
                  v-model="newStudent.last_name"
                  class="mt-1"
                />
              </div>
            </div>
            <div>
              <Label for="student_username">Foydalanuvchi nomi</Label>
              <Input
                id="student_username"
                v-model="newStudent.username"
                class="mt-1"
              />
            </div>
            <div>
              <Label for="student_phone">Telefon raqami</Label>
              <Input
                id="student_phone"
                v-model="newStudent.phone"
                class="mt-1"
              />
            </div>
            <div>
              <Label for="student_level_id">Daraja</Label>
              <Select v-model="newStudent.level_id" class="mt-1 w-full">
                <SelectTrigger id="student_level_id">
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
            <div>
              <Label for="student_password">Parol</Label>
              <div class="relative mt-1">
                <Input
                  id="student_password"
                  v-model="newStudent.password"
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
            <Button variant="outline" @click="convertToStudentDialog = false"
              >Bekor qilish</Button
            >
            <Button type="submit" :disabled="isCreatingStudent">
              <Icon
                v-if="isCreatingStudent"
                name="lucide:loader-2"
                class="mr-2 h-4 w-4 animate-spin"
              />
              {{ isCreatingStudent ? "Yaratilmoqda..." : "Talaba yaratish" }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Edit Lead Dialog -->
    <Dialog v-model:open="editLeadDialog">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Leadni tahrirlash</DialogTitle>
          <DialogDescription>
            Lead ma'lumotlarini yangilash
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="updateLead">
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <Label for="edit_first_name">Ism</Label>
                <Input
                  id="edit_first_name"
                  v-model="editingLead.first_name"
                  class="mt-1"
                />
              </div>
              <div>
                <Label for="edit_last_name">Familiya</Label>
                <Input
                  id="edit_last_name"
                  v-model="editingLead.last_name"
                  class="mt-1"
                />
              </div>
            </div>

            <div>
              <Label for="edit_phone">Telefon raqami</Label>
              <Input id="edit_phone" v-model="editingLead.phone" class="mt-1" />
            </div>

            <div>
              <Label for="edit_question">So'rov/Savol</Label>
              <Textarea
                id="edit_question"
                v-model="editingLead.question"
                class="mt-1"
                rows="3"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <Label for="edit_status">Holat</Label>
                <Select v-model="editingLead.status" class="mt-1 w-full">
                  <SelectTrigger id="edit_status">
                    <SelectValue placeholder="Holatni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yangi">Yangi</SelectItem>
                    <SelectItem value="Aloqada">Aloqada</SelectItem>
                    <SelectItem value="Sinovda">Sinovda</SelectItem>
                    <SelectItem value="Sinovda qatnashdi">Sinovda qatnashdi</SelectItem>
                    <SelectItem value="O'qishga yozildi">O'qishga yozildi</SelectItem>
                    <SelectItem value="Yo'qotildi">Yo'qotildi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label for="edit_source">Lead manbai</Label>
                <Select v-model="editingLead.source" class="mt-1 w-full">
                  <SelectTrigger id="edit_source">
                    <SelectValue placeholder="Manbani tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Telegram">Telegram</SelectItem>
                    <SelectItem value="Do'stimdan">Do'stimdan</SelectItem>
                    <SelectItem value="O'zim keldim">O'zim keldim</SelectItem>
                    <SelectItem value="Flayer">Flayer</SelectItem>
                    <SelectItem value="Banner(yondagi)">Banner(yondagi)</SelectItem>
                    <SelectItem value="Banner(ko'chadagi)">Banner(ko'chadagi)</SelectItem>
                    <SelectItem value="Boshqa">Boshqa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label for="edit_course_id">Qiziqayotgan kurs</Label>
              <Select v-model="editingLead.course_id" class="mt-1 w-full">
                <SelectTrigger id="edit_course_id">
                  <SelectValue placeholder="Kursni tanlang" />
                </SelectTrigger>
                <SelectContent>
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

            <div>
              <Label for="edit_notes">Qo'shimcha izohlar</Label>
              <Textarea
                id="edit_notes"
                v-model="editingLead.notes"
                class="mt-1"
                rows="3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" @click="editLeadDialog = false">Bekor qilish</Button>
            <Button type="submit" :disabled="isUpdatingLead">
              <Icon
                v-if="isUpdatingLead"
                name="lucide:loader-2"
                class="mr-2 h-4 w-4 animate-spin"
              />
              {{ isUpdatingLead ? "Yangilanmoqda..." : "Leadni yangilash" }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "~/composables/useAuth";
import { useToast } from "~/composables/useToast";
import { api } from "~/lib/api";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

definePageMeta({
  middleware: ["auth"],
});

const { apiService } = useAuth();
const { toast } = useToast();

// Define Lead type interface
interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  question: string;
  status: string;
  source: string;
  course_id: string;
  admin_id: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Define Trial Lesson interface
interface TrialLesson {
  id: string;
  lead_id: string;
  teacher_id: string;
  scheduledAt: string;
  status: string;
  notes: string;
}

// Data
const leads = ref<Lead[]>([]);
const courses = ref<any[]>([]);
const teachers = ref<any[]>([]);
const isLoading = ref(true);
const isCreatingLead = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);
const isSavingTrial = ref(false);
const isCreatingStudent = ref(false);

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalLeads = ref(0);
const totalPages = computed(() =>
  Math.ceil(totalLeads.value / itemsPerPage.value)
);
const paginationStart = computed(
  () => (currentPage.value - 1) * itemsPerPage.value + 1
);
const paginationEnd = computed(() =>
  Math.min(currentPage.value * itemsPerPage.value, totalLeads.value)
);

// Filters
const search = ref("");
const filterStatus = ref("_all");
const filterSource = ref("_all");
const filterDate = ref("_all");

// Dialogs
const viewLeadDialog = ref(false);
const changeStatusDialog = ref(false);
const trialLessonDialog = ref(false);
const deleteConfirmDialog = ref(false);
const convertToStudentDialog = ref(false);
const editLeadDialog = ref(false);
const showPassword = ref(false);
const selectedLead = ref<Lead | null>(null);
const leadTrialLessons = ref<TrialLesson[]>([]);
const newLeadStatus = ref("");
const leadToDelete = ref<Lead | null>(null);
const leadToConvert = ref<Lead | null>(null);
const isUpdatingLead = ref(false);

// Edit lead form
const editingLead = reactive<Lead>({
  id: "",
  first_name: "",
  last_name: "",
  phone: "",
  question: "",
  status: "",
  source: "",
  course_id: "",
  admin_id: "",
  notes: "",
  createdAt: "",
  updatedAt: "",
  deletedAt: null,
});

// New lead form
const newLead = reactive({
  first_name: "",
  last_name: "",
  phone: "",
  question: "",
  status: "Yangi",
  source: "",
  course_id: "",
  admin_id: "17374076-ff4c-4c38-bfc4-92575434ce29", // Using the admin_id from the sample data
  notes: "",
});

// New student form
const newStudent = reactive({
  first_name: "",
  last_name: "",
  username: "",
  phone: "",
  password: "",
  level_id: "none",
});

// Trial lesson form
const trialLesson = reactive({
  scheduledDate: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
  scheduledTime: "10:00",
  teacher_id: "",
  status: "belgilangan",
  lead_id: "",
  notes: "",
});

// Time slots for trial lessons
const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
];

// Lead statuses
const leadStatuses = [
  { value: "Yangi", label: "Yangi", description: "Lead has just been created" },
  {
    value: "Aloqada",
    label: "Aloqada",
    description: "In communication with the lead",
  },
  { value: "Sinovda", label: "Sinovda", description: "Trial lesson scheduled" },
  {
    value: "Sinovda qatnashdi",
    label: "Sinovda qatnashdi",
    description: "Completed trial lesson",
  },
  {
    value: "O'qishga yozildi",
    label: "O'qishga yozildi",
    description: "Converted to student",
  },
  { value: "Yo'qotildi", label: "Yo'qotildi", description: "Lead did not convert" },
];

// Computed properties
const filteredLeads = computed(() => {
  let result = [...leads.value];

  // Apply search
  if (search.value) {
    const searchLower = search.value.toLowerCase();
    result = result.filter(
      (lead) =>
        `${lead.first_name} ${lead.last_name}`
          .toLowerCase()
          .includes(searchLower) ||
        lead.phone.toLowerCase().includes(searchLower)
    );
  }

  // Apply status filter
  if (filterStatus.value !== "_all") {
    result = result.filter((lead) => lead.status === filterStatus.value);
  }

  // Apply source filter
  if (filterSource.value !== "_all") {
    result = result.filter((lead) => lead.source === filterSource.value);
  }

  // Apply date filter
  if (filterDate.value !== "_all") {
    const now = new Date();
    let compareDate = new Date();

    switch (filterDate.value) {
      case "today":
        compareDate.setHours(0, 0, 0, 0);
        result = result.filter(
          (lead) => new Date(lead.createdAt) >= compareDate
        );
        break;
      case "yesterday":
        compareDate.setDate(compareDate.getDate() - 1);
        compareDate.setHours(0, 0, 0, 0);
        const yesterdayEnd = new Date(compareDate);
        yesterdayEnd.setHours(23, 59, 59, 999);
        result = result.filter((lead) => {
          const leadDate = new Date(lead.createdAt);
          return leadDate >= compareDate && leadDate <= yesterdayEnd;
        });
        break;
      case "week":
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
        compareDate = new Date(now.setDate(diff));
        compareDate.setHours(0, 0, 0, 0);
        result = result.filter(
          (lead) => new Date(lead.createdAt) >= compareDate
        );
        break;
      case "month":
        compareDate = new Date(now.getFullYear(), now.getMonth(), 1);
        result = result.filter(
          (lead) => new Date(lead.createdAt) >= compareDate
        );
        break;
    }
  }

  // The total count should now come from the API response
  // We're already setting totalLeads.value from the response

  // No need to apply pagination here as it's handled server-side
  return result;
});

// Methods
const loadLeads = async () => {
  isLoading.value = true;
  try {
    // Build query parameters
    let queryParams = `page=${currentPage.value}&limit=${itemsPerPage.value}`;

    // Add search parameter if exists
    if (search.value) {
      queryParams += `&search=${encodeURIComponent(search.value)}`;
    }

    // Add status filter if not "all"
    if (filterStatus.value !== "_all") {
      queryParams += `&status=${encodeURIComponent(filterStatus.value)}`;
    }

    // Add source filter if not "all"
    if (filterSource.value !== "_all") {
      queryParams += `&source=${encodeURIComponent(filterSource.value)}`;
    }

    // Add date filter if not "all"
    if (filterDate.value !== "_all") {
      queryParams += `&dateFilter=${encodeURIComponent(filterDate.value)}`;
    }

    // Use pagination parameters in the API request
    const response = await api.get<{
      leads: Lead[];
      total: number;
      totalPages: number;
      currentPage: number;
    }>(apiService.value, `/leads?${queryParams}`);

    if (response) {
      leads.value = response.leads || [];
      totalLeads.value = response.total || 0;
      totalPages.value =
        response.totalPages || Math.ceil(totalLeads.value / itemsPerPage.value);
      currentPage.value = response.currentPage || currentPage.value;
    }

    isLoading.value = false;
  } catch (error) {
    console.error("Failed to load leads:", error);
    toast({
      title: "Error",
      description: "Failed to load leads. Please try again.",
      variant: "destructive",
    });
    isLoading.value = false;
  }
};

const loadCourses = async () => {
  try {
    const response = await api.get(apiService.value, "/courses");
    courses.value = response || [];
  } catch (error) {
    console.error("Failed to load courses:", error);
    toast({
      title: "Xatolik",
      description: "Kurslarni yuklashda xatolik. Standart qiymatlar ishlatilmoqda.",
      variant: "destructive",
    });
  }
};

const loadTeachers = async () => {
  try {
    const response = await api.get(apiService.value, "/users/teachers");
    teachers.value = response || [];
  } catch (error) {
    console.error("Failed to load teachers:", error);
    toast({
      title: "Xatolik",
      description: "O'qituvchilarni yuklashda xatolik. Standart qiymatlar ishlatilmoqda.",
      variant: "destructive",
    });
  }
};

const refreshLeads = () => {
  loadLeads();
};

const createLead = async () => {
  isCreatingLead.value = true;
  try {
    // Set admin ID based on logged in user
    newLead.admin_id = "17374076-ff4c-4c38-bfc4-92575434ce29"; // Using the admin_id from the sample data

    // Make API call to create the lead
    const response = await api.post<Lead>(apiService.value, "/leads", newLead);

    if (response) {
      // Add the created lead to the local array
      leads.value.unshift(response);
      totalLeads.value++;

      toast({
        title: "Muvaffaqiyat",
        description: "Lead muvaffaqiyatli yaratildi",
      });

      // Reset form
      newLead.first_name = "";
      newLead.last_name = "";
      newLead.phone = "";
      newLead.question = "";
      newLead.status = "Yangi";
      newLead.source = "";
      newLead.course_id = "";
      newLead.notes = "";
    }
    // Close dialog (handled by v-model:open binding)
  } catch (error) {
    console.error("Failed to create lead:", error);
    toast({
      title: "Xatolik",
      description: "Lead yaratishda xatolik. Qaytadan urinib ko'ring.",
      variant: "destructive",
    });
  } finally {
    isCreatingLead.value = false;
  }
};

const viewLead = (lead: Lead) => {
  selectedLead.value = lead;
  viewLeadDialog.value = true;

  // Fetch trial lessons for this lead
  fetchLeadTrialLessons(lead.id);
};

// Fetch trial lessons for a lead
const fetchLeadTrialLessons = async (leadId: string) => {
  try {
    const response = await api.get<{ trialLessons?: TrialLesson[] }>(
      apiService.value,
      `/lead-trial-lessons/by-lead/${leadId}`
    );
    leadTrialLessons.value = response.trialLessons || [];
  } catch (error) {
    console.error("Failed to fetch trial lessons:", error);
    leadTrialLessons.value = [];
    toast({
      title: "Xatolik",
      description: "Ushbu lead uchun sinov darslarini yuklab bo'lmadi.",
      variant: "destructive",
    });
  }
};

const editLead = (lead: Lead) => {
  // Copy lead data to editingLead to avoid direct mutation
  Object.assign(editingLead, lead);
  editLeadDialog.value = true;
};

const updateLead = async () => {
  isUpdatingLead.value = true;
  try {
    // Make API call to update the lead
    const response = await api.patch<Lead>(
      apiService.value, 
      `/leads/${editingLead.id}`, 
      {
        first_name: editingLead.first_name,
        last_name: editingLead.last_name,
        phone: editingLead.phone,
        question: editingLead.question,
        status: editingLead.status,
        source: editingLead.source,
        course_id: editingLead.course_id,
        notes: editingLead.notes,
      }
    );

    if (response) {
      // Update the lead in the local array
      const index = leads.value.findIndex(l => l.id === editingLead.id);
      if (index !== -1) {
        leads.value[index] = { ...leads.value[index], ...response };
      }

      // If the lead was being viewed, update the selectedLead as well
      if (selectedLead.value && selectedLead.value.id === editingLead.id) {
        selectedLead.value = { ...selectedLead.value, ...response };
      }

      toast({
        title: "Muvaffaqiyat",
        description: "Lead muvaffaqiyatli yangilandi",
      });

      // Close the edit dialog
      editLeadDialog.value = false;
    }
  } catch (error) {
    console.error("Failed to update lead:", error);
    toast({
      title: "Xatolik",
      description: "Lead ma'lumotlarini yangilashda xatolik",
      variant: "destructive",
    });
  } finally {
    isUpdatingLead.value = false;
  }
};

const changeLeadStatus = (lead: Lead) => {
  selectedLead.value = lead;
  newLeadStatus.value = lead.status;
  changeStatusDialog.value = true;
};

const updateLeadStatus = async () => {
  if (!selectedLead.value) return;

  isUpdating.value = true;
  try {
    // Make API call to update the lead status
    await api.patch(apiService.value, `/leads/${selectedLead.value.id}`, {
      status: newLeadStatus.value,
    });

    // Update locally
    const index = leads.value.findIndex(
      (lead) => lead.id === selectedLead.value?.id
    );
    if (index !== -1) {
      leads.value[index] = {
        ...leads.value[index],
        status: newLeadStatus.value,
        updatedAt: new Date().toISOString(),
      };
    }

    // Update selected lead if view dialog is open
    if (selectedLead.value) {
      selectedLead.value = {
        ...selectedLead.value,
        status: newLeadStatus.value,
        updatedAt: new Date().toISOString(),
      };
    }

    toast({
      title: "Muvaffaqiyat",
      description: "Lead holati muvaffaqiyatli yangilandi",
    });

    // Close dialog
    changeStatusDialog.value = false;
  } catch (error) {
    console.error("Failed to update lead status:", error);
    toast({
      title: "Xatolik",
      description: "Lead holatini yangilashda xatolik. Qaytadan urinib ko'ring.",
      variant: "destructive",
    });
  } finally {
    isUpdating.value = false;
  }
};

const scheduleTrialLesson = (lead: Lead) => {
  if (!lead) return;

  selectedLead.value = lead;

  // Reset form
  trialLesson.scheduledDate = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
  trialLesson.scheduledTime = "10:00";
  trialLesson.teacher_id = "";
  trialLesson.status = "belgilangan";
  trialLesson.lead_id = lead.id;
  trialLesson.notes = "";

  trialLessonDialog.value = true;
};

const saveTrialLesson = async () => {
  isSavingTrial.value = true;
  try {
    // Combine date and time
    const scheduledDate = new Date(trialLesson.scheduledDate);
    const [hours, minutes] = trialLesson.scheduledTime.split(":").map(Number);
    if (hours !== undefined && minutes !== undefined) {
      scheduledDate.setHours(hours, minutes);
    }

    const trialLessonData = {
      scheduledAt: scheduledDate.toISOString(),
      teacher_id: trialLesson.teacher_id,
      lead_id: trialLesson.lead_id,
      status: trialLesson.status,
      notes: trialLesson.notes,
    };

    // Make API call to create trial lesson
    const response = await api.post<TrialLesson>(
      apiService.value,
      "/lead-trial-lessons",
      trialLessonData
    );

    // If lead is in 'Yangi' or 'Aloqada' status, update to 'Sinovda'
    if (
      selectedLead.value &&
      (selectedLead.value.status === "Yangi" ||
        selectedLead.value.status === "Aloqada")
    ) {
      // Update lead status via API
      await api.patch(apiService.value, `/leads/${selectedLead.value.id}`, {
        status: "Sinovda",
      });

      // Update locally
      const index = leads.value.findIndex(
        (lead) => lead.id === selectedLead.value?.id
      );
      if (index !== -1) {
        leads.value[index] = {
          ...leads.value[index],
          status: "Sinovda",
          updatedAt: new Date().toISOString(),
        };
      }

      // Update selected lead if view dialog is open
      if (selectedLead.value) {
        selectedLead.value = {
          ...selectedLead.value,
          status: "Sinovda",
          updatedAt: new Date().toISOString(),
        };
      }
    }

    // Add trial lesson to list if view dialog is open
    if (viewLeadDialog.value && response) {
      leadTrialLessons.value.push(response);
    }

    toast({
      title: "Muvaffaqiyat",
      description: "Sinov darsi muvaffaqiyatli rejalashtirildi",
    });

    // Close dialog
    trialLessonDialog.value = false;
  } catch (error) {
    console.error("Failed to schedule trial lesson:", error);
    toast({
      title: "Xatolik",
      description: "Sinov darsini rejalashtirishda xatolik. Qaytadan urinib ko'ring.",
      variant: "destructive",
    });
  } finally {
    isSavingTrial.value = false;
  }
};

const confirmDeleteLead = (lead: Lead) => {
  leadToDelete.value = lead;
  deleteConfirmDialog.value = true;
};

const deleteLead = async () => {
  if (!leadToDelete.value) return;

  isDeleting.value = true;
  try {
    // Make API call to delete the lead
    await api.delete(apiService.value, `/leads/${leadToDelete.value.id}`);

    // Remove from local array
    leads.value = leads.value.filter(
      (lead) => lead.id !== leadToDelete.value?.id
    );
    totalLeads.value--;

    toast({
      title: "Muvaffaqiyat",
      description: "Lead muvaffaqiyatli o'chirildi",
    });

    // Close dialog
    deleteConfirmDialog.value = false;

    // If view dialog is open and we're deleting the same lead, close it
    if (
      viewLeadDialog.value &&
      selectedLead.value?.id === leadToDelete.value.id
    ) {
      viewLeadDialog.value = false;
    }
  } catch (error) {
    console.error("Failed to delete lead:", error);
    toast({
      title: "Xatolik",
      description: "Leadni o'chirishda xatolik. Qaytadan urinib ko'ring.",
      variant: "destructive",
    });
  } finally {
    isDeleting.value = false;
  }
};

const convertToStudent = (lead: Lead) => {
  leadToConvert.value = lead;

  // Prefill the student form with lead information
  newStudent.first_name = lead.first_name;
  newStudent.last_name = lead.last_name;
  newStudent.phone = lead.phone;

  // Generate a username suggestion based on first name and last name
  const firstNameLower = lead.first_name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const lastNameLower = lead.last_name.toLowerCase().replace(/[^a-z0-9]/g, "");
  newStudent.username = `${firstNameLower}_${lastNameLower}`;

  // Set level_id from lead's interested course, or "none" if not set
  newStudent.level_id = lead.course_id || "none";

  // Reset password
  newStudent.password = "";

  // Open the dialog
  convertToStudentDialog.value = true;
};

const createStudentFromLead = async () => {
  if (!leadToConvert.value) return;

  isCreatingStudent.value = true;
  try {
    // Create a copy of newStudent to prepare for submission
    const studentData = { ...newStudent };

    // Set level_id to empty string if it's 'none'
    if (studentData.level_id === "none") {
      studentData.level_id = "";
    }

    // Create the student using the API
    const response = await api.post(
      apiService.value,
      "/auth/register",
      studentData
    );

    // Update the lead status to "O'qishga yozildi" (Enrolled)
    await api.patch(apiService.value, `/leads/${leadToConvert.value.id}`, {
      status: "O'qishga yozildi",
    });

    // Update the lead locally
    const index = leads.value.findIndex(
      (lead) => lead.id === leadToConvert.value?.id
    );
    if (index !== -1) {
      leads.value[index] = {
        ...leads.value[index],
        status: "O'qishga yozildi",
        updatedAt: new Date().toISOString(),
      };
    }

    // Update selected lead if view dialog is open
    if (
      selectedLead.value &&
      selectedLead.value.id === leadToConvert.value.id
    ) {
      selectedLead.value = {
        ...selectedLead.value,
        status: "O'qishga yozildi",
        updatedAt: new Date().toISOString(),
      };
    }

    toast({
      title: "Muvaffaqiyat",
      description: "Lead muvaffaqiyatli talabaga aylantirildi",
    });

    // Close dialog
    convertToStudentDialog.value = false;

    // If the view dialog is open, close it too
    if (viewLeadDialog.value) {
      viewLeadDialog.value = false;
    }
  } catch (error) {
    console.error("Failed to create student:", error);
    toast({
      title: "Xatolik",
      description: "Talaba yaratishda xatolik. Qaytadan urinib ko'ring.",
      variant: "destructive",
    });
  } finally {
    isCreatingStudent.value = false;
  }
};

// Helper functions
const getStatusVariant = (status: string) => {
  switch (status) {
    case "Yangi":
      return "default";
    case "Aloqada":
      return "secondary";
    case "Sinovda":
      return "warning";
    case "Sinovda qatnashdi":
      return "info";
    case "O'qishga yozildi":
      return "success";
    case "Yo'qotildi":
      return "destructive";
    default:
      return "outline";
  }
};

const getStatusDisplay = (status: string) => {
  switch (status) {
    case "Yangi":
      return "Yangi";
    case "Aloqada":
      return "Aloqada";
    case "Sinovda":
      return "Sinovda";
    case "Sinovda qatnashdi":
      return "Sinovda qatnashdi";
    case "O'qishga yozildi":
      return "O'qishga yozildi";
    case "Yo'qotildi":
      return "Yo'qotildi";
    default:
      return status;
  }
};

const getSourceDisplay = (source: string) => {
  switch (source) {
    case "Instagram":
      return "Instagram";
    case "Telegram":
      return "Telegram";
    case "Do'stimdan":
      return "Do'stimdan";
    case "O'zim keldim":
      return "O'zim keldim";
    case "Flayer":
      return "Flayer";
    case "Banner(yondagi)":
      return "Banner (yondagi)";
    case "Banner(ko'chadagi)":
      return "Banner (ko'chadagi)";
    case "Boshqa":
      return "Boshqa";
    default:
      return source;
  }
};

const getTrialStatusVariant = (status: string) => {
  switch (status) {
    case "belgilangan":
      return "secondary";
    case "keldi":
      return "success";
    case "kelmadi":
      return "destructive";
    default:
      return "outline";
  }
};

const getTrialStatusDisplay = (status: string) => {
  switch (status) {
    case "belgilangan":
      return "belgilangan";
    case "keldi":
      return "Sinovda qatnashdi";
    case "kelmadi":
      return "Sinovda qatnashmadi";
    default:
      return status;
  }
};

const getCourseTitle = (courseId: string) => {
  const course = courses.value.find((c) => c.id === courseId);
  return course ? course.title : "Unknown Course";
};

const getTeacherName = (teacherId: string) => {
  const teacher = teachers.value.find((t) => t.user_id === teacherId);
  return teacher ? `${teacher.first_name} ${teacher.last_name}` : "Unassigned";
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

const formatDateTime = (dateTimeString: string) => {
  if (!dateTimeString) return "N/A";
  const date = new Date(dateTimeString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

// CSV Export function
const exportLeadsToCSV = () => {
  // Use the same filtering logic as filteredLeads computed property
  // but don't apply pagination to get all matching leads
  let leadsToExport = [...leads.value];
  const dateLabel =
    filterDate.value === "_all"
      ? "Barchasi"
      : filterDate.value === "today"
      ? "Bugun"
      : filterDate.value === "yesterday"
      ? "Kecha"
      : filterDate.value === "week"
      ? "Shu hafta"
      : "Bu oy";

  // Apply search
  if (search.value) {
    const searchLower = search.value.toLowerCase();
    leadsToExport = leadsToExport.filter(
      (lead) =>
        `${lead.first_name} ${lead.last_name}`
          .toLowerCase()
          .includes(searchLower) ||
        lead.phone.toLowerCase().includes(searchLower)
    );
  }

  // Apply status filter
  if (filterStatus.value !== "_all") {
    leadsToExport = leadsToExport.filter(
      (lead) => lead.status === filterStatus.value
    );
  }

  // Apply source filter
  if (filterSource.value !== "_all") {
    leadsToExport = leadsToExport.filter(
      (lead) => lead.source === filterSource.value
    );
  }

  // Apply date filter
  if (filterDate.value !== "_all") {
    const now = new Date();
    let compareDate = new Date();

    switch (filterDate.value) {
      case "today":
        compareDate.setHours(0, 0, 0, 0);
        leadsToExport = leadsToExport.filter(
          (lead) => new Date(lead.createdAt) >= compareDate
        );
        break;
      case "yesterday":
        compareDate.setDate(compareDate.getDate() - 1);
        compareDate.setHours(0, 0, 0, 0);
        const yesterdayEnd = new Date(compareDate);
        yesterdayEnd.setHours(23, 59, 59, 999);
        leadsToExport = leadsToExport.filter((lead) => {
          const leadDate = new Date(lead.createdAt);
          return leadDate >= compareDate && leadDate <= yesterdayEnd;
        });
        break;
      case "week":
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
        compareDate = new Date(now.setDate(diff));
        compareDate.setHours(0, 0, 0, 0);
        leadsToExport = leadsToExport.filter(
          (lead) => new Date(lead.createdAt) >= compareDate
        );
        break;
      case "month":
        compareDate = new Date(now.getFullYear(), now.getMonth(), 1);
        leadsToExport = leadsToExport.filter(
          (lead) => new Date(lead.createdAt) >= compareDate
        );
        break;
    }
  }

  // Create CSV content
  const headers = [
    "ID",
    "First Name",
    "Last Name",
    "Phone",
    "Status",
    "Source",
    "Interested Course",
    "Question",
    "Notes",
    "Created Date",
  ];

  let csvContent = headers.join(",") + "\n";

  leadsToExport.forEach((lead) => {
    // Format data for CSV, escaping commas and quotes
    const courseTitle = getCourseTitle(lead.course_id)
      .replace(/,/g, " ")
      .replace(/"/g, '""');
    const question = (lead.question || "")
      .replace(/,/g, " ")
      .replace(/"/g, '""');
    const notes = (lead.notes || "").replace(/,/g, " ").replace(/"/g, '""');
    const row = [
      lead.id,
      lead.first_name.replace(/,/g, " ").replace(/"/g, '""'),
      lead.last_name.replace(/,/g, " ").replace(/"/g, '""'),
      lead.phone,
      getStatusDisplay(lead.status),
      getSourceDisplay(lead.source),
      courseTitle,
      `"${question}"`,
      `"${notes}"`,
      formatDate(lead.createdAt),
    ];
    csvContent += row.join(",") + "\n";
  });

  // Create and download the CSV file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `leads_${dateLabel.replace(/\s+/g, "_").toLowerCase()}_${
      new Date().toISOString().split("T")[0]
    }.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast({
    title: "Muvaffaqiyat",
    description: `${leadsToExport.length} ta lead eksport qilindi (${dateLabel})`,
  });
};

// Remove the mock data generator function since we're using real API data
// onMounted(() => {
//   loadLeads();
//   loadCourses();
//   loadTeachers();
// });

// Remove generateMockLeads function since we're using real API data
// const generateMockLeads = (count) => { ... };

// Load data on component mount
onMounted(() => {
  // Get the pagination parameters from URL
  const route = useRoute();
  if (route.query.page) {
    currentPage.value = parseInt(route.query.page as string) || 1;
  }
  if (route.query.limit) {
    itemsPerPage.value = parseInt(route.query.limit as string) || 10;
  }

  loadLeads();
  loadCourses();
  loadTeachers();
});

// Watch for pagination changes to update URL
const route = useRoute();
const router = useRouter();

// Navigation functions for pagination
const navigatePage = (newPage: number) => {
  currentPage.value = newPage;
  updateUrlParams();
};

const onPageChange = (newPage: number) => {
  currentPage.value = newPage;
  updateUrlParams();
};

const updateUrlParams = () => {
  // Create query object with pagination params
  const query: Record<string, string> = {
    page: currentPage.value.toString(),
    limit: itemsPerPage.value.toString(),
  };

  // Add filter params if they exist
  if (search.value) {
    query.search = search.value;
  }

  if (filterStatus.value !== "_all") {
    query.status = filterStatus.value;
  }

  if (filterSource.value !== "_all") {
    query.source = filterSource.value;
  }

  if (filterDate.value !== "_all") {
    query.dateFilter = filterDate.value;
  }

  // Update URL with all params
  router.push({ query });
};



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

// Watch for pagination parameter changes to reload leads
watch([currentPage, itemsPerPage], () => {
  loadLeads();
});

// Watch for filter changes and reset to page 1
watch([search, filterStatus, filterSource, filterDate], () => {
  // Reset to page 1 when filters change
  currentPage.value = 1;
  // Update URL params
  updateUrlParams();
  // Reload data with new filters
  loadLeads();
});
</script>
