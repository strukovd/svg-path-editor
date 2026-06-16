/**
 * SVG Path Command Type Definitions
 *
 * Pure union types for SVG path commands with zero runtime overhead.
 */

/**
 * Absolute SVG path command types (uppercase)
 */
export type PathCommandsAbs = 'M' | 'L' | 'H' | 'V' | 'C' | 'S' | 'Q' | 'T' | 'A' | 'Z';

/**
 * Relative SVG path command types (lowercase)
 */
export type PathCommandsRelative = 'm' | 'l' | 'h' | 'v' | 'c' | 's' | 'q' | 't' | 'a' | 'z';

/**
 * Any SVG path command type (absolute or relative)
 */
export type PathCommands = PathCommandsAbs | PathCommandsRelative;

/**
 * Type guard to check if a string is a valid absolute SVG command type
 */
export function isPathCommandAbsolute(value: string): value is PathCommandsAbs {
  return /^[MLHVCSQTAZ]$/.test(value);
}

/**
 * Type guard to check if a string is a valid relative SVG command type
 */
export function isPathCommandRelative(value: string): value is PathCommandsRelative {
  return /^[mlhvcsqtaz]$/.test(value);
}

/**
 * Type guard to check if a string is any valid SVG command type
 */
export function isPathCommand(value: string): value is PathCommands {
  return /^[MLHVCSQTAZmlhvcsqtaz]$/.test(value);
}
