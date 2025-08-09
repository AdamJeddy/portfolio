declare module 'sanitize-html' {
  export interface IFrame {
    tag: string
    attribs: Record<string, string>
  }
  export interface SanitizeOptions {
    allowedTags?: string[] | false
    allowedAttributes?: Record<string, string[]>
    transformTags?: Record<
      string,
      | string
      | ((tagName: string, attribs: Record<string, string>) => {
          tagName: string
          attribs?: Record<string, string>
        })
    >
  }
  export default function sanitizeHtml(
    dirty: string,
    options?: SanitizeOptions
  ): string
}
