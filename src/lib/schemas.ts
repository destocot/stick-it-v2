import * as v from 'valibot'

// Message convention: every schema and action carries an explicit message,
// written as a full sentence in the second person. Presence failures say
// "Please enter your X."; constraint failures say "Your X must ...".

export const SignUpSchema = v.object({
  email: v.pipe(
    v.string('Your email must be a string.'),
    v.trim(),
    v.nonEmpty('Please enter your email.'),
    v.email('The email address is badly formatted.'),
  ),
  username: v.pipe(
    v.string('Your username must be a string.'),
    v.trim(),
    v.nonEmpty('Please enter your username.'),
    v.minLength(3, 'Your username must have 3 characters or more.'),
    v.maxLength(20, 'Your username must have 20 characters or fewer.'),
    v.regex(
      /^[a-z0-9_]+$/i,
      'Your username can only contain letters, numbers and underscores.',
    ),
  ),
  // Deliberately not trimmed — trimming a password silently changes it.
  password: v.pipe(
    v.string('Your password must be a string.'),
    v.nonEmpty('Please enter your password.'),
    v.minLength(8, 'Your password must have 8 characters or more.'),
  ),
})

export type SignUpInput = v.InferOutput<typeof SignUpSchema>

/** First validation message for a payload, or null when it is valid. */
export function firstIssue<TSchema extends v.GenericSchema>(
  schema: TSchema,
  input: unknown,
): string | null {
  const result = v.safeParse(schema, input)
  return result.success ? null : result.issues[0].message
}
