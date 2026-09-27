import * as v from 'valibot'

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
  password: v.pipe(
    v.string('Your password must be a string.'),
    v.nonEmpty('Please enter your password.'),
    v.minLength(8, 'Your password must have 8 characters or more.'),
  ),
})

export const SignInSchema = v.object({
  email: v.pipe(
    v.string('Your email must be a string.'),
    v.trim(),
    v.nonEmpty('Please enter your email.'),
    v.email('The email address is badly formatted.'),
  ),
  password: v.pipe(
    v.string('Your password must be a string.'),
    v.nonEmpty('Please enter your password.'),
  ),
})
