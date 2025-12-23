<template>
  <div class="py-8">
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 animate-spin text-primary-500"
      />
    </div>

    <UContainer v-else class="max-w-4xl">
      <div class="space-y-6">
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Profile Information</h2>
          </template>

          <template #default>
            <div class="space-y-6">
              <div class="flex items-center gap-6">
                <UAvatar
                  :src="formData.avatar || 'https://i.pravatar.cc/150'"
                  :alt="formData.username"
                  size="2xl"
                />
                <div class="space-y-2">
                  <UButton variant="outline" size="sm" @click="changeAvatar">
                    Change Avatar
                  </UButton>
                  <UInput
                    v-if="showAvatarInput"
                    v-model="formData.avatar"
                    placeholder="https://..."
                    size="xs"
                    class="mt-2"
                  />
                  <p class="text-xs text-gray-500">
                    Enter a URL for your avatar image.
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="First Name *" name="firstName">
                  <UInput
                    v-model="formData.firstName"
                    type="text"
                    placeholder="Your first name"
                    disabled
                  >
                    <template #trailing>
                      <UIcon
                        name="i-heroicons-lock-closed"
                        class="text-gray-400"
                      />
                    </template>
                  </UInput>
                  <p class="text-xs text-gray-500 mt-1">
                    Contact support to change your first name.
                  </p>
                </UFormGroup>
                <UFormGroup label="Last Name *" name="lastName">
                  <UInput
                    v-model="formData.lastName"
                    type="text"
                    placeholder="Your last name"
                    disabled
                  >
                    <template #trailing>
                      <UIcon
                        name="i-heroicons-lock-closed"
                        class="text-gray-400"
                      />
                    </template>
                  </UInput>
                  <p class="text-xs text-gray-500 mt-1">
                    Contact support to change your last name.
                  </p>
                </UFormGroup>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="Username *" name="username">
                  <UInput v-model="formData.username" placeholder="username" />
                </UFormGroup>
                <UFormGroup label="Email *" name="email">
                  <UInput
                    v-model="formData.email"
                    type="email"
                    placeholder="your@email.com"
                    disabled
                  >
                    <template #trailing>
                      <UIcon
                        name="i-heroicons-lock-closed"
                        class="text-gray-400"
                      />
                    </template>
                  </UInput>
                  <p class="text-xs text-gray-500 mt-1">
                    Contact support to change your email.
                  </p>
                </UFormGroup>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="Location" name="location">
                  <UInput
                    v-model="formData.location"
                    placeholder="City, Country"
                    icon="i-heroicons-map-pin"
                  />
                </UFormGroup>

                <UFormGroup label="Website" name="website">
                  <UInput
                    v-model="formData.website"
                    placeholder="https://yourwebsite.com"
                    icon="i-heroicons-link"
                  />
                </UFormGroup>
              </div>

              <UFormGroup label="Bio" name="bio">
                <UTextarea
                  v-model="formData.bio"
                  class="w-full"
                  limit="500"
                  placeholder="Tell us about yourself..."
                  :rows="3"
                />
                <p class="text-xs text-gray-500 mt-1 text-right">
                  {{ formData.bio?.length || 0 }}/500
                </p>
              </UFormGroup>
            </div>
          </template>

          <template #footer>
            <div class="flex justify-end">
              <UButton color="primary" :loading="saving" @click="saveProfile">
                Save Changes
              </UButton>
            </div>
          </template>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Preferences</h2>
          </template>

          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  Email Notifications
                </p>
                <p class="text-sm text-gray-500">
                  Receive email notifications for activity
                </p>
              </div>
              <USwitch v-model="formData.emailNotifications" />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  Newsletter
                </p>
                <p class="text-sm text-gray-500">
                  Receive weekly newsletter updates
                </p>
              </div>
              <USwitch v-model="formData.newsletter" />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  Public Profile
                </p>
                <p class="text-sm text-gray-500">
                  Make your profile visible to everyone
                </p>
              </div>
              <USwitch v-model="formData.publicProfile" />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  Show Email
                </p>
                <p class="text-sm text-gray-500">
                  Display your email address on your profile
                </p>
              </div>
              <USwitch v-model="formData.showEmail" />
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end">
              <UButton
                color="primary"
                :loading="saving"
                @click="saveProfilePreferences"
              >
                Save Changes
              </UButton>
            </div>
          </template>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold text-red-600 dark:text-red-400">
              Danger Zone
            </h2>
          </template>

          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/10"
            >
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  Delete Account
                </p>
                <p class="text-sm text-gray-500">
                  Permanently delete your account and all your data
                </p>
              </div>
              <UButton color="error" variant="solid" @click="deleteAccount">
                Delete Account
              </UButton>
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import {
  deleteUser,
  updateUserSettings,
  updateUserSettingsPreferences,
} from '~/scripts/backend/user/userOperations'

definePageMeta({
  middleware: 'auth',
})

const { user, clear: clearSession } = useUserSession()
const toast = useToast()
const config = useRuntimeConfig()
const currentUserStore = useCurrentUserStore()

const loading = ref(true)
const saving = ref(false)
const showAvatarInput = ref(false)

const formData = ref({
  username: '',
  email: '',
  avatar: '',
  bio: '',
  firstName: '',
  lastName: '',
  location: '',
  website: '',

  emailNotifications: false,
  newsletter: false,
  publicProfile: false,
  showEmail: false,
})

onMounted(async () => {
  if (user.value?.userId) {
    try {
      await currentUserStore.fetchCurrentUser(config, user.value.userId, true)
      const userData = currentUserStore.currentUser

      if (userData) {
        formData.value = {
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          username: userData.username || '',
          email: userData.email || '',
          avatar: userData.avatar || '',
          bio: userData.bio || '',
          location: userData.location || '',
          website: userData.website || '',

          emailNotifications: userData.emailNotifications || false,
          newsletter: userData.newsletter || false,
          publicProfile: userData.publicProfile || false,
          showEmail: userData.showEmail || false,
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.add({
        title: 'Error',
        description: 'Failed to load user settings',
        color: 'error',
      })
    } finally {
      loading.value = false
    }
  }
})

const changeAvatar = () => {
  showAvatarInput.value = !showAvatarInput.value
}

async function saveProfile() {
  if (!currentUserStore.currentUser?.id) return

  saving.value = true

  try {
    const response = await updateUserSettings(
      config,
      currentUserStore.currentUser.id,
      {
        username: formData.value.username,
        bio: formData.value.bio,
        location: formData.value.location,
        website: formData.value.website,
        avatar: formData.value.avatar,
      },
    )

    if (response.success) {
      toast.add({
        title: 'Success',
        description: 'Profile updated successfully',
        color: 'success',
      })
      await currentUserStore.fetchCurrentUser(
        config,
        currentUserStore.currentUser.id,
        true,
      )
    } else {
      throw new Error(response.message)
    }
  } catch (error: any) {
    console.error('Error saving profile:', error)
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to update profile',
      color: 'error',
    })
  } finally {
    saving.value = false
  }
}

async function saveProfilePreferences() {
  if (!currentUserStore.currentUser?.id) return

  saving.value = true

  try {
    const response = await updateUserSettingsPreferences(
      config,
      currentUserStore.currentUser.id,
      {
        emailNotifications: formData.value.emailNotifications,
        newsletter: formData.value.newsletter,
        publicProfile: formData.value.publicProfile,
        showEmail: formData.value.showEmail,
      },
    )

    if (response.success) {
      toast.add({
        title: 'Success',
        description: 'Profile updated successfully',
        color: 'success',
      })
      await currentUserStore.fetchCurrentUser(
        config,
        currentUserStore.currentUser.id,
        true,
      )
    } else {
      throw new Error(response.message)
    }
  } catch (error: any) {
    console.error('Error saving profile:', error)
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to update profile',
      color: 'error',
    })
  } finally {
    saving.value = false
  }
}

async function deleteAccount() {
  if (!currentUserStore.currentUser?.id) return

  const confirmed = confirm(
    'Are you absolutely sure you want to delete your account? This action cannot be undone.',
  )

  if (confirmed) {
    const doubleConfirm = prompt('Type DELETE to confirm account deletion.')

    if (doubleConfirm === 'DELETE') {
      try {
        await deleteUser(config, currentUserStore.currentUser.id)

        await clearSession()
        currentUserStore.clearCurrentUser()

        navigateTo('/')
        toast.add({ title: 'Account Deleted', color: 'primary' })
      } catch (error) {
        console.error(error)
        toast.add({
          title: 'Error',
          description: 'Failed to delete account',
          color: 'error',
        })
      }
    }
  }
}
</script>
