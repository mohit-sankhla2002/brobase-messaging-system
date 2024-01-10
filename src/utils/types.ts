export type Message = {
    userId: String, 
    payload: String,
    type: "default_message" | "group_message",
    groupId ?: string
}
