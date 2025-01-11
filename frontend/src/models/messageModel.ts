export interface MessageModel {
    id: string;
    createdAt: string;
    updatedAt: string;
    text: string;
    image: string;
    senderId: string;
    receiverId: string;
}
export interface TypingStatus {
    senderId: string | null;
    receiverId: string | null;
    isTyping: boolean;
    text: string;
}
export interface DeletedStatus {
    isDeletedBySender?: boolean;
    isDeletedByReceiver?: boolean;
}