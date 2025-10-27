import googleConfig from "../config/googleConfig";

class AlertService {
  constructor() {
    this.baseUrl = googleConfig.api_base_url;
  }

  // Gửi email alert
  async sendEmailAlert(subject, message, to = null) {
    try {
      const response = await fetch(`${this.baseUrl}/alerts/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: to || googleConfig.email.to,
          subject: subject,
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error sending email alert:", error);
      throw error;
    }
  }

  // Gửi Telegram alert
  async sendTelegramAlert(message) {
    try {
      const response = await fetch(`${this.baseUrl}/alerts/telegram`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error sending Telegram alert:", error);
      throw error;
    }
  }

  // Kiểm tra ngưỡng và gửi alert
  async checkThresholdAlert(value, metric = "value", type = "high") {
    try {
      const threshold =
        type === "high"
          ? googleConfig.alert_threshold_high
          : googleConfig.alert_threshold_low;

      const shouldAlert =
        type === "high" ? value > threshold : value < threshold;

      if (shouldAlert) {
        const subject = `⚠️ ${type.toUpperCase()} Alert: ${metric}`;
        const message = `
          🚨 ALERT: ${metric} threshold exceeded!

          Current Value: ${value}
          Threshold: ${threshold}
          Alert Type: ${type.toUpperCase()}
          Time: ${new Date().toLocaleString()}

          Please take immediate action.
        `;

        // Gửi cả email và telegram
        const emailResult = await this.sendEmailAlert(subject, message);

        // Telegram alert (optional)
        if (googleConfig.telegram.bot_token && googleConfig.telegram.chat_id) {
          await this.sendTelegramAlert(
            `🚨 ${subject}\n\nValue: ${value}\nThreshold: ${threshold}`,
          );
        }

        return {
          alertSent: true,
          value: value,
          threshold: threshold,
          type: type,
          emailResult: emailResult,
        };
      }

      return {
        alertSent: false,
        value: value,
        threshold: threshold,
        type: type,
      };
    } catch (error) {
      console.error("Error checking threshold alert:", error);
      throw error;
    }
  }

  // Gửi báo cáo định kỳ
  async sendScheduledReport(reportData) {
    try {
      const subject = `📊 Scheduled Report - ${new Date().toLocaleDateString()}`;
      const message = `
        📈 DAILY REPORT

        Generated: ${new Date().toLocaleString()}

        Summary:
        ${JSON.stringify(reportData, null, 2)}

        This is an automated report from React Google Integration system.
      `;

      const result = await this.sendEmailAlert(subject, message);
      return result;
    } catch (error) {
      console.error("Error sending scheduled report:", error);
      throw error;
    }
  }

  // Test kết nối email
  async testEmailConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/alerts/test-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error testing email connection:", error);
      throw error;
    }
  }

  // Test kết nối Telegram
  async testTelegramConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/alerts/test-telegram`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error testing Telegram connection:", error);
      throw error;
    }
  }

  // Lấy lịch sử alerts
  async getAlertHistory() {
    try {
      const response = await fetch(`${this.baseUrl}/alerts/history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting alert history:", error);
      throw error;
    }
  }

  // Format alert message
  formatAlertMessage(title, data, priority = "normal") {
    const emoji =
      priority === "high" ? "🔴" : priority === "medium" ? "🟡" : "🟢";
    const timestamp = new Date().toLocaleString();

    return `${emoji} ${title}\n\n${data}\n\n⏰ ${timestamp}`;
  }
}

const alertService = new AlertService();
export default alertService;
