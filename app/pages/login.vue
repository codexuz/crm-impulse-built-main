<template>
  <div
    class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-muted/40"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight">
        Impulse Study CRM
      </h2>
      <p class="mt-2 text-center text-sm text-muted-foreground">
        Hisobingizga kiring
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <Label for="username">Foydalanuvchi nomi</Label>
            <Input
              id="username"
              v-model="username"
              name="username"
              type="text"
              autocomplete="username"
              required
              class="mt-1"
            />
            <p v-if="errors.username" class="text-sm text-destructive mt-1">
              {{ errors.username }}
            </p>
          </div>
          <div>
            <Label for="password">Parol</Label>
            <Input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="mt-1"
            />
            <p v-if="errors.password" class="text-sm text-destructive mt-1">
              {{ errors.password }}
            </p>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Checkbox id="remember-me" v-model:checked="rememberMe" />
              <label
                for="remember-me"
                class="ml-2 block text-sm text-muted-foreground"
              >
                Meni eslab qol
              </label>
            </div>

            <div class="text-sm">
              <a
                href="#"
                class="font-medium text-primary hover:text-primary/90"
              >
                Parolni unutdingizmi?
              </a>
            </div>
          </div>

          <div>
            <Button type="submit" class="w-full" :disabled="isLoading">
              <Icon
                v-if="isLoading"
                name="lucide:loader-2"
                class="mr-2 h-4 w-4 animate-spin"
              />
              {{ isLoading ? "Kirilmoqda..." : "Kirish" }}
            </Button>
          </div>

          <div
            v-if="loginError"
            class="p-3 text-sm text-destructive bg-destructive/10 rounded-md"
          >
            {{ loginError }}
            <Button
              v-if="loginError.includes('network') || loginError.includes('tarmoq')"
              variant="outline"
              size="sm"
              class="mt-2 w-full"
              @click="handleLogin"
            >
              Qayta urinish
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const { login } = useAuth();
const router = useRouter();

const username = ref("");
const password = ref("");
const rememberMe = ref(false);
const errors = ref<Record<string, string>>({});
const isLoading = ref(false);
const loginError = ref("");

const validateForm = (): boolean => {
  errors.value = {};

  // Handle the specific validation for username
  if (!username.value || !username.value.trim()) {
    errors.value.username = "Foydalanuvchi nomi bo'sh bo'lishi mumkin emas";
  }

  // Handle the specific validation for password
  if (!password.value) {
    errors.value.password = "Parol bo'sh bo'lishi mumkin emas";
  } else if (password.value.length < 6) {
    errors.value.password = "Parol kamida 6 ta belgidan iborat bo'lishi kerak";
  }

  return Object.keys(errors.value).length === 0;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  loginError.value = "";

  try {
    console.log("Attempting login with:", username.value);
    await login(username.value, password.value);
    router.push("/");
  } catch (error) {
    console.error("Login error details:", error);

    // Extract error message from different error formats
    let errorMessage =
      "Tizimga kirishda xatolik. Iltimos, ma'lumotlaringizni tekshiring va qayta urinib ko'ring.";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "object" && error !== null) {
      // @ts-ignore
      errorMessage = error.message || error.error || errorMessage;
    }

    // Check for common errors and provide helpful messages
    if (errorMessage.includes("401") || errorMessage.includes("unauthorized")) {
      errorMessage = "Noto'g'ri foydalanuvchi nomi yoki parol. Iltimos, qayta urinib ko'ring.";
    } else if (errorMessage.includes("400")) {
      errorMessage =
        "Tizimga kirishda xatolik. Iltimos, foydalanuvchi nomi va parolingizni to'g'ri kiritganingizga ishonch hosil qiling.";
    } else if (
      errorMessage.includes("network") ||
      errorMessage.includes("failed to fetch")
    ) {
      errorMessage =
        "Tarmoq xatosi. Iltimos, internet ulanishingizni tekshiring va qayta urinib ko'ring.";
    }

    loginError.value = errorMessage;
  } finally {
    isLoading.value = false;
  }
};
</script>
