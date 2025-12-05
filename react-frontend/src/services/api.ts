import {
  authJwtLogin,
  registerRegister,
  authJwtLogout,
  resetForgotPassword,
  readItem,
  createItem,
  deleteItem,
  usersCurrentUser
} from '@/clientService'
import { loginSchema, registerSchema, itemSchema } from '@/lib/definitions'
import { getErrorMessage } from '@/lib/utils'
import { getAuthHeaders, setAccessToken, removeAccessToken } from '@/lib/auth'

// Auth services
export async function login(username: string, password: string) {
  const validatedFields = loginSchema.safeParse({ username, password })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const { data, error } = await authJwtLogin({
      body: {
        username,
        password,
      },
    })

    if (error) {
      return { server_validation_error: getErrorMessage(error) }
    }

    if (data?.access_token) {
      setAccessToken(data.access_token)
      return { success: true }
    }

    return { server_error: 'An unexpected error occurred. Please try again later.' }
  } catch (err) {
    console.error('Login error:', err)
    return {
      server_error: 'An unexpected error occurred. Please try again later.',
    }
  }
}

export async function register(email: string, password: string) {
  const validatedFields = registerSchema.safeParse({ email, password })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const { error } = await registerRegister({
      body: {
        email,
        password,
      },
    })

    if (error) {
      return { server_validation_error: getErrorMessage(error) }
    }

    return { success: true }
  } catch (err) {
    console.error('Registration error:', err)
    return {
      server_error: 'An unexpected error occurred. Please try again later.',
    }
  }
}

export async function logout() {
  const headers = getAuthHeaders()

  if (!('Authorization' in headers)) {
    removeAccessToken()
    return { success: true }
  }

  try {
    await authJwtLogout({ headers })
    removeAccessToken()
    return { success: true }
  } catch (err) {
    console.error('Logout error:', err)
    removeAccessToken() // Remove token even if API call fails
    return { success: true }
  }
}

export async function passwordResetRequest(email: string) {
  try {
    const { error } = await resetForgotPassword({
      body: {
        email,
      },
    })

    if (error) {
      return { server_validation_error: getErrorMessage(error) }
    }

    return {
      success: true,
      message: 'Password reset email sent. Please check your inbox.'
    }
  } catch (err) {
    console.error('Password reset error:', err)
    return {
      server_error: 'An unexpected error occurred. Please try again later.',
    }
  }
}

// Item services
export interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
}

export async function fetchItems(): Promise<Item[] | { message: string }> {
  const headers = getAuthHeaders()

  if (!('Authorization' in headers)) {
    return { message: 'No access token found' }
  }

  try {
    const { data, error } = await readItem({ headers })

    if (error) {
      return { message: typeof error === 'string' ? error : 'Failed to fetch items' }
    }

    return (data as Item[]) || []
  } catch (err) {
    console.error('Fetch items error:', err)
    return { message: 'An unexpected error occurred' }
  }
}

export async function addItem(name: string, description: string, quantity: string) {
  const headers = getAuthHeaders()

  if (!('Authorization' in headers)) {
    return { message: 'No access token found' }
  }

  const validatedFields = itemSchema.safeParse({
    name,
    description,
    quantity,
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  const { name: validName, description: validDescription, quantity: validQuantity } = validatedFields.data

  try {
    const { error } = await createItem({
      headers,
      body: {
        name: validName,
        description: validDescription,
        quantity: validQuantity,
      },
    })

    if (error) {
      return { message: `${error.detail || 'Failed to create item'}` }
    }

    return { success: true }
  } catch (err) {
    console.error('Add item error:', err)
    return { message: 'An unexpected error occurred' }
  }
}

export async function removeItem(id: string) {
  const headers = getAuthHeaders()

  if (!('Authorization' in headers)) {
    return { message: 'No access token found' }
  }

  try {
    const { error } = await deleteItem({
      headers,
      path: {
        item_id: id,
      },
    })

    if (error) {
      return { message: error }
    }

    return { success: true }
  } catch (err) {
    console.error('Remove item error:', err)
    return { message: 'An unexpected error occurred' }
  }
}

