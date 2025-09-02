export class SendbirdUtils {
  private state: any;

  constructor(state: any) {
    this.state = state;
  }

  /**
   * Создает новый канал
   */
  async createChannel(name: string, userIds: string[], isDistinct = false) {
    try {
      // Используем SDK через stores если доступен
      const sdk = this.state?.stores?.sdkStore?.sdk;
      if (!sdk?.groupChannel) {
        return { success: false, error: "SDK not available" };
      }

      const channel = await sdk.groupChannel.createChannel({
        name,
        userIds,
        isDistinct,
      });
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
      const sdk = this.state?.stores?.sdkStore?.sdk;
      if (!sdk?.groupChannel) {
        return { success: false, error: "SDK not available" };
      }

      const count = await sdk.groupChannel.getTotalUnreadChannelCount();
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
      const sdk = this.state?.stores?.sdkStore?.sdk;
      if (!sdk?.groupChannel) {
        return { success: false, error: "SDK not available" };
      }

      const result = await sdk.groupChannel.sendMessage({
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
      const sdk = this.state?.stores?.sdkStore?.sdk;
      if (!sdk?.groupChannel) {
        return { success: false, error: "SDK not available" };
      }

      const channels = await sdk.groupChannel.getMyGroupChannels({
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
  async connect(userId: string) {
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
    const sdk = this.state?.stores?.sdkStore?.sdk;
    return {
      hasSDK: !!sdk,
      hasGroupChannel: !!sdk?.groupChannel,
      connectionState: sdk?.connectionState,
      isReady: !!(sdk && sdk.groupChannel && sdk.connectionState === "OPEN"),
    };
  }
}
