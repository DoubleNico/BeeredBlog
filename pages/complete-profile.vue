<template>
  <div class="min-h-screen flex bg-gray-50 dark:bg-gray-900">
    <div
      class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 justify-center items-center p-12"
    >
      <div
        class="absolute inset-0 bg-gradient-to-tr from-primary-900/40 to-gray-900"
      />
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"
      />

      <div class="relative z-10 max-w-lg text-center">
        <div
          class="w-20 h-20 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-8 shadow-xl backdrop-blur-sm"
        >
          <UIcon
            name="i-heroicons-user-plus"
            class="w-10 h-10 text-primary-400"
          />
        </div>

        <h1 class="text-4xl font-bold text-white mb-6">Almost There!</h1>

        <p class="text-gray-400 text-lg mb-12 leading-relaxed">
          We just need a few more details to set up your writer profile. Choose
          a unique username to establish your identity.
        </p>

        <div class="grid grid-cols-2 gap-8 border-t border-gray-800 pt-8">
          <div>
            <div class="text-3xl font-bold text-white mb-1">100%</div>
            <div class="text-sm text-primary-400 font-medium">Ownership</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-white mb-1">Secure</div>
            <div class="text-sm text-primary-400 font-medium">Identity</div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
      <div class="w-full max-w-md space-y-8">
        <div class="text-center">
          <div
            class="lg:hidden w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4"
          >
            <UIcon
              name="i-heroicons-user-plus"
              class="w-6 h-6 text-primary-500"
            />
          </div>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
            Complete Profile
          </h2>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Finalize your account setup
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <UFormGroup
              label="First Name"
              name="firstName"
              :error="errors.firstName"
            >
              <UInput
                v-model="form.firstName"
                placeholder="John"
                size="lg"
                icon="i-heroicons-user"
              />
            </UFormGroup>

            <UFormGroup
              label="Last Name"
              name="lastName"
              :error="errors.lastName"
            >
              <UInput v-model="form.lastName" placeholder="Doe" size="lg" />
            </UFormGroup>
          </div>

          <UFormGroup
            label="Username"
            name="username"
            :error="errors.username"
            help="This will be your unique handle (e.g., @johndoe)"
          >
            <UInput
              v-model="form.username"
              placeholder="johndoe"
              size="lg"
              icon="i-heroicons-at-symbol"
              :color="errors.username ? 'error' : 'neutral'"
            />
          </UFormGroup>

          <UFormGroup label="Email Address" name="email">
            <UInput
              v-model="form.email"
              :icon="
                provider === 'google'
                  ? 'i-simple-icons-google'
                  : 'i-simple-icons-github'
              "
              variant="outline"
              color="neutral"
              size="lg"
              disabled
            />
            <template #help>
              <span class="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <UIcon name="i-heroicons-lock-closed" class="w-3 h-3" />
                Linked to your
                {{ provider === 'google' ? 'Google' : 'GitHub' }} account
              </span>
            </template>
          </UFormGroup>

          <div class="flex items-start">
            <UCheckbox
              v-model="form.agreeToTerms"
              name="terms"
              :color="errors.agreeToTerms ? 'error' : 'primary'"
            >
              <template #label>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the
                  <ULink to="/terms" class="text-primary-500 underline"
                    >Terms of Service</ULink
                  >
                  and confirm I am at least 18 years old.
                </span>
              </template>
            </UCheckbox>
          </div>

          <UAlert
            v-if="generalError"
            icon="i-heroicons-exclamation-triangle"
            color="error"
            variant="subtle"
            title="Error"
            :description="generalError"
          />

          <UButton
            type="submit"
            block
            size="xl"
            color="primary"
            :loading="isSubmitting"
            :disabled="!isFormValid"
          >
            Complete Registration
          </UButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const { fetch: refreshSession } = useUserSession()

const provider = (route.query.provider as string) || 'google'
const queryEmail = route.query.email as string
const queryName = route.query.name as string
const queryFirstName = route.query.firstName as string
const queryLastName = route.query.lastName as string
const queryOAuthId = (route.query.githubId || route.query.googleId) as string
const queryEmailVerified = route.query.emailVerified as string
const queryPicture = route.query.picture as string
const returnTo = (route.query.from as string) || 'login'

if (!queryEmail || !queryOAuthId) {
  navigateTo(`/${returnTo}?error=invalid_oauth_session`)
}

const form = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: queryEmail || '',
  agreeToTerms: false,
})

const errors = reactive({
  firstName: '',
  lastName: '',
  username: '',
  agreeToTerms: false,
})

const generalError = ref('')
const isSubmitting = ref(false)

if (queryFirstName) {
  form.firstName = queryFirstName
}
if (queryLastName) {
  form.lastName = queryLastName
}

if (!form.username && form.email) {
  form.username = queryName
}

const validate = () => {
  let valid = true

  Object.keys(errors).forEach((k) => (errors[k as keyof typeof errors] = ''))
  generalError.value = ''

  if (!form.firstName) {
    errors.firstName = 'Required'
    valid = false
  }
  if (!form.lastName) {
    errors.lastName = 'Required'
    valid = false
  }

  if (!form.username || form.username.length < 4) {
    errors.username = 'Username must be at least 4 characters'
    valid = false
  } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
    errors.username =
      'Username can only contain letters, numbers, and underscores'
    valid = false
  }

  if (!form.agreeToTerms) {
    errors.agreeToTerms = true
    valid = false
    generalError.value = 'You must agree to the terms.'
  }

  return valid
}

const isFormValid = computed(() => {
  return form.firstName && form.username && form.agreeToTerms
})

const handleSubmit = async () => {
  if (!validate()) return

  isSubmitting.value = true

  try {
    const response = await $fetch<{
      success: boolean
      message: string
      user?: { id: string }
    }>(`${config.public.backend}/api/auth/oauth/google/complete`, {
      method: 'POST',
      body: {
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        googleId: queryOAuthId,
        picture: queryPicture,
        emailVerified: queryEmailVerified === 'true',
      },
    })

    if (response.success && response.user) {
      await $fetch('/api/auth/session', {
        method: 'POST',
        body: {
          userId: response.user.id,
        },
      })

      await refreshSession()

      await navigateTo('/home')
    } else {
      generalError.value = response.message || 'Registration failed.'
    }
  } catch (error: any) {
    console.error(error)
    generalError.value = error.data?.message || 'An unexpected error occurred.'
  } finally {
    isSubmitting.value = false
  }
}

useHead({
  title: 'Complete Profile - JavaBlog',
})
</script>
