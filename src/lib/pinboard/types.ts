export type YesNo = 'yes' | 'no';

/**
 * https://pinboard.in/api#posts_add
 */
export interface PinboardPostsAddParams {
  url: string;
  auth_token?: string;
  /** Title */
  description?: string;
  /** Actual description */
  extended?: string;
  tags?: string;
  /** Created at in UTC ISO-8601 */
  dt?: string;
  replace?: YesNo;
  shared?: YesNo;
  toread?: YesNo;
  format?: 'json';
  /** Index signature for query param encoding */
  [key: string]: any;
}
