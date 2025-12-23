export class DateTime {
  private date: Date
  private serverTimezone: string
  private static readonly DEFAULT_SERVER_TIMEZONE = 'Europe/Bucharest'
  private userTimezone: string

  constructor(
    dateInput: number[] | string | Date,
    serverTimezone: string = DateTime.DEFAULT_SERVER_TIMEZONE,
    userTimezone?: string,
  ) {
    this.serverTimezone = serverTimezone
    this.userTimezone =
      userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone
    this.date = this.parseDateTime(dateInput)
  }

  private parseDateTime(dateInput: number[] | string | Date): Date {
    if (dateInput instanceof Date) {
      return dateInput
    }

    if (typeof dateInput === 'string') {
      return new Date(dateInput)
    }

    if (Array.isArray(dateInput) && dateInput.length >= 6) {
      const [year, month, day, hour, minute, second, nanosecond = 0] = dateInput

      if (
        year !== undefined &&
        month !== undefined &&
        day !== undefined &&
        hour !== undefined &&
        minute !== undefined &&
        second !== undefined
      ) {
        const jsMonth = month - 1
        const millisecond = Math.floor((nanosecond || 0) / 1000000)

        const serverDate = new Date(
          year,
          jsMonth,
          day,
          hour,
          minute,
          second,
          millisecond,
        )

        if (
          this.serverTimezone !== DateTime.DEFAULT_SERVER_TIMEZONE &&
          this.serverTimezone !== this.userTimezone
        ) {
          return this.convertTimezone(
            serverDate,
            this.serverTimezone,
            DateTime.DEFAULT_SERVER_TIMEZONE,
          )
        }

        return serverDate
      }
    }

    console.warn('Could not parse date:', dateInput)
    return new Date()
  }

  private convertTimezone(
    date: Date,
    fromTimezone: string,
    toTimezone: string,
  ): Date {
    const sourceOffset = this.getTimezoneOffset(date, fromTimezone)
    const targetOffset = this.getTimezoneOffset(date, toTimezone)
    const offsetDifference = targetOffset - sourceOffset

    return new Date(date.getTime() + offsetDifference)
  }

  private getTimezoneOffset(date: Date, timezone: string): number {
    const utc1 = new Date(
      date.toLocaleString('en-US', {
        timeZone: DateTime.DEFAULT_SERVER_TIMEZONE,
      }),
    )
    const utc2 = new Date(date.toLocaleString('en-US', { timeZone: timezone }))
    return utc2.getTime() - utc1.getTime()
  }

  toDate(): Date {
    return new Date(this.date)
  }

  toUserTimezone(): Date {
    if (this.serverTimezone === this.userTimezone) {
      return this.date
    }
    return this.convertTimezone(
      this.date,
      this.serverTimezone,
      this.userTimezone,
    )
  }

  formatChatTime(): string {
    const userDate = this.toUserTimezone()
    const now = new Date()

    if (now.toDateString() === userDate.toDateString()) {
      return userDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    } else {
      return userDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    }
  }

  toJavaArray(): number[] {
    const userDate = this.toUserTimezone()
    return [
      userDate.getFullYear(),
      userDate.getMonth() + 1,
      userDate.getDate(),
      userDate.getHours(),
      userDate.getMinutes(),
      userDate.getSeconds(),
      userDate.getMilliseconds() * 1000000,
    ]
  }

  formatMessageTime(): string {
    const userDate = this.toUserTimezone()
    const now = new Date()
    const diffInMs = now.getTime() - userDate.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) {
      return 'Just now'
    }

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    }

    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    }

    if (diffInDays < 7) {
      return userDate.toLocaleDateString('en-US', {
        weekday: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    }

    return userDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year:
        userDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  formatFull(): string {
    const userDate = this.toUserTimezone()
    return userDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    })
  }

  getRelativeTime(): string {
    const userDate = this.toUserTimezone()
    const now = new Date()
    const diffInMs = now.getTime() - userDate.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30)
      return `${Math.floor(diffInDays / 7)} week${
        Math.floor(diffInDays / 7) > 1 ? 's' : ''
      } ago`
    if (diffInDays < 365)
      return `${Math.floor(diffInDays / 30)} month${
        Math.floor(diffInDays / 30) > 1 ? 's' : ''
      } ago`

    return `${Math.floor(diffInDays / 365)} year${
      Math.floor(diffInDays / 365) > 1 ? 's' : ''
    } ago`
  }

  isToday(): boolean {
    const userDate = this.toUserTimezone()
    const now = new Date()
    return now.toDateString() === userDate.toDateString()
  }

  isYesterday(): boolean {
    const userDate = this.toUserTimezone()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday.toDateString() === userDate.toDateString()
  }

  isThisWeek(): boolean {
    const userDate = this.toUserTimezone()
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    return userDate >= startOfWeek && userDate <= endOfWeek
  }

  getTimezoneInfo(): {
    server: string
    user: string
    offsetDifference: number
    offsetDifferenceHours: number
  } {
    const serverOffset = this.getTimezoneOffset(this.date, this.serverTimezone)
    const userOffset = this.getTimezoneOffset(this.date, this.userTimezone)
    const offsetDifference = userOffset - serverOffset

    return {
      server: this.serverTimezone,
      user: this.userTimezone,
      offsetDifference,
      offsetDifferenceHours: offsetDifference / (1000 * 60 * 60),
    }
  }

  static fromJavaArray(
    javaArray: number[],
    serverTimezone: string = DateTime.DEFAULT_SERVER_TIMEZONE,
    userTimezone?: string,
  ): DateTime {
    return new DateTime(javaArray, serverTimezone, userTimezone)
  }

  static now(
    serverTimezone: string = DateTime.DEFAULT_SERVER_TIMEZONE,
    userTimezone?: string,
  ): DateTime {
    return new DateTime(new Date(), serverTimezone, userTimezone)
  }

  static fromISO(
    isoString: string,
    serverTimezone: string = DateTime.DEFAULT_SERVER_TIMEZONE,
    userTimezone?: string,
  ): DateTime {
    return new DateTime(isoString, serverTimezone, userTimezone)
  }
}
