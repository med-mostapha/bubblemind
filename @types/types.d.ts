type KnowledgeType = "website" | "csv" | "text";

interface KnowledgeSource {
  id: string;
  organization_id: string;
  type: KnowledgeType;
  title: string;
  source_url: string | null;
  raw_content: string;
  summarized_content: string;
  createdAt: string;
}

interface UserSession {
  email: string;
  organization_id: string;
}

// Widget settings
type BubblePosition = "bottom-right" | "bottom-left";
type BubbleSize = "small" | "medium" | "large";

interface PublicWidgetConfig {
  bubble_position: BubblePosition;
  bubble_color: string;
  bubble_icon: string;
  bubble_icon_url: string;
  bubble_size: BubbleSize;
  bubble_animation: string;
  tooltip_text: string;
  window_primary_color: string;
  window_background_color: string;
  window_border_radius: string;
  window_font_family: string;
  window_header_title: string;
  window_header_subtitle: string;
  company_logo_url: string;
  use_logo_as_bubble: string;
  opening_message: string;
  opening_message_enabled: string;
}

interface Conversation {
  id: string;
  title: string | null;
  createdAt: string;
  messageCount: number;
}

type MessageRole = "user" | "assistant" | "system";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}
