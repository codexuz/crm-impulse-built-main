import { api } from "~/lib/api";
import { useAuth } from "./useAuth";

export interface PaymentAction {
    payment_id: string;
    manager_id: string;
    stage: "upcoming" | "debitor";
    action_type: "sms" | "phone" | "in_person";
    message: string;
    next_action_date: string;
}

export interface SMSReminderOptions {
    paymentId: string;
    studentName: string;
    amount: number;
    dueDate: string;
    customMessage?: string;
    actionType?: "sms" | "phone" | "in_person";
}

export const useSMS = () => {
    const { apiService, auth } = useAuth();

    /**
     * Send a payment reminder via SMS
     */
    const sendPaymentReminder = async (options: SMSReminderOptions) => {
        const {
            paymentId,
            studentName,
            amount,
            dueDate,
            customMessage,
            actionType = "sms",
        } = options;

        // Get the current user (manager) ID
        const managerId = auth.value.user?.id;

        if (!managerId) {
            throw new Error("Manager ID not found. Please log in again.");
        }

        // Format currency for SMS (e.g., "1,300,000 so'm")
        const formatCurrency = (amount: number): string => {
            return new Intl.NumberFormat("uz-UZ").format(amount) + " so'm";
        };

        // Format date for SMS (DD.MM.YYYY)
        const formatDate = (dateString: string): string => {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        };

        // Default message template
        const defaultMessage = `Hurmatli ${studentName}, ${formatCurrency(amount)} miqdorida to'lovingiz ${formatDate(dueDate)} sanasida muddati tugaydi. O'z vaqtida to'lov qilishingizni so'raymiz. Impulse Study LC`;

        // Prepare the payload
        const payload: PaymentAction = {
            payment_id: paymentId,
            manager_id: managerId,
            stage: "upcoming",
            action_type: actionType,
            message: customMessage || defaultMessage,
            next_action_date: dueDate,
        };

        // Call the payment-actions endpoint
        const response = await api.post<any>(
            apiService.value,
            "/payment-actions",
            payload
        );

        return response;
    };

    /**
     * Send a custom SMS message
     */
    const sendCustomSMS = async (
        paymentId: string,
        message: string,
        nextActionDate: string,
        stage: "upcoming" | "debitor",
        actionType: "sms" | "phone" | "in_person"
    ) => {
        const managerId = auth.value.user?.id;

        if (!managerId) {
            throw new Error("Manager ID not found. Please log in again.");
        }

        const payload: PaymentAction = {
            payment_id: paymentId,
            manager_id: managerId,
            stage,
            action_type: actionType,
            message,
            next_action_date: nextActionDate,
        };

        const response = await api.post<any>(
            apiService.value,
            "/payment-actions",
            payload
        );

        return response;
    };

    /**
     * Record a phone call action
     */
    const recordPhoneCall = async (
        paymentId: string,
        notes: string,
        nextActionDate: string
    ) => {
        return sendCustomSMS(paymentId, notes, nextActionDate, "upcoming", "phone");
    };

    /**
     * Record an in-person meeting action
     */
    const recordInPersonMeeting = async (
        paymentId: string,
        notes: string,
        nextActionDate: string
    ) => {
        return sendCustomSMS(
            paymentId,
            notes,
            nextActionDate,
            "upcoming",
            "in_person"
        );
    };

    return {
        sendPaymentReminder,
        sendCustomSMS,
        recordPhoneCall,
        recordInPersonMeeting,
    };
};
