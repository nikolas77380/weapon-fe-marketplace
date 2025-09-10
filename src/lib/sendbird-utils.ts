import { CreateChannelResponse } from "./sendbird";

export class SendbirdUtils {
  private state: unknown;

  constructor(state: unknown) {
    this.state = state;
  }

  /**
   * Форматирует timestamp в читаемый формат даты
   * @param timestamp - timestamp в миллисекундах
   * @returns отформатированная дата в формате "20 Aug, 2025 09:36"
   */
  static formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day} ${month}, ${year} ${hours}:${minutes}`;
  }

  /**
   * Создает новый канал
   */
  async createChannel(name: string, userIds: string[], isDistinct = false) {
    try {
      // Используем SDK через stores если доступен
      const sdk = (this.state as { stores?: { sdkStore?: { sdk?: unknown } } })
        ?.stores?.sdkStore?.sdk;
      if (!(sdk as { groupChannel?: unknown })?.groupChannel) {
        return { success: false, error: "SDK not available" };
      }

      const channel = (await (
        sdk as {
          groupChannel: {
            createChannel: (params: unknown) => Promise<unknown>;
          };
        }
      ).groupChannel.createChannel({
        name,
        userIds,
        isDistinct,
      })) as CreateChannelResponse["channel"];
      await this.sendMessage(channel.channelUrl, "Hello!");
      return { success: true, channel };
    } catch (error) {
      console.error("Error creating channel:", error);
      return { success: false, error };
    }
  }

  /**
   * Получает количество непрочитанных сообщений
   */
  async getUnreadCount() {
    try {
      const sdk = (this.state as { stores?: { sdkStore?: { sdk?: unknown } } })
        ?.stores?.sdkStore?.sdk;
      if (!(sdk as { groupChannel?: unknown })?.groupChannel) {
        return { success: false, error: "SDK not available" };
      }

      const count = await (
        sdk as {
          groupChannel: { getTotalUnreadChannelCount: () => Promise<unknown> };
        }
      ).groupChannel.getTotalUnreadChannelCount();
      return { success: true, count };
    } catch (error) {
      console.error("Error getting unread count:", error);
      return { success: false, error };
    }
  }

  /**
   * Отправляет сообщение в канал
   */
  async sendMessage(channelUrl: string, message: string) {
    try {
      const sdk = (this.state as { stores?: { sdkStore?: { sdk?: unknown } } })
        ?.stores?.sdkStore?.sdk;
      if (!(sdk as { groupChannel?: unknown })?.groupChannel) {
        return { success: false, error: "SDK not available" };
      }

      const result = await (
        sdk as {
          groupChannel: { sendMessage: (params: unknown) => Promise<unknown> };
        }
      ).groupChannel.sendMessage({
        channelUrl,
        message,
      });
      return { success: true, result };
    } catch (error) {
      console.error("Error sending message:", error);
      return { success: false, error };
    }
  }

  /**
   * Получает список каналов пользователя
   */
  async getChannels() {
    try {
      const sdk = (this.state as { stores?: { sdkStore?: { sdk?: unknown } } })
        ?.stores?.sdkStore?.sdk;
      if (!(sdk as { groupChannel?: unknown })?.groupChannel) {
        return { success: false, error: "SDK not available" };
      }

      const channels = await (
        sdk as {
          groupChannel: {
            getMyGroupChannels: (params: unknown) => Promise<unknown>;
          };
        }
      ).groupChannel.getMyGroupChannels({
        limit: 20,
      });
      return { success: true, channels };
    } catch (error) {
      console.error("Error getting channels:", error);
      return { success: false, error };
    }
  }

  /**
   * Подключается к Sendbird
   */
  async connect() {
    try {
      return {
        success: false,
        error: "Connect method not available in current implementation",
      };
    } catch (error) {
      console.error("Error connecting:", error);
      return { success: false, error };
    }
  }

  /**
   * Отключается от Sendbird
   */
  async disconnect() {
    try {
      return {
        success: false,
        error: "Disconnect method not available in current implementation",
      };
    } catch (error) {
      console.error("Error disconnecting:", error);
      return { success: false, error };
    }
  }

  /**
   * Получает статус готовности SDK
   */
  getSDKStatus() {
    const sdk = (this.state as { stores?: { sdkStore?: { sdk?: unknown } } })
      ?.stores?.sdkStore?.sdk;
    return {
      hasSDK: !!sdk,
      hasGroupChannel: !!(sdk as { groupChannel?: unknown })?.groupChannel,
      connectionState: (sdk as { connectionState?: string })?.connectionState,
      isReady: !!(
        sdk &&
        (sdk as { groupChannel?: unknown; connectionState?: string })
          .groupChannel &&
        (sdk as { connectionState?: string }).connectionState === "OPEN"
      ),
    };
  }
}
