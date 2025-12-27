import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../src/pages/Login/Login';
import { BrowserRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

jest.mock('js-cookie');

// Mocking axios
jest.mock('axios', () => {
  const mockAxiosInstance = {
    post: jest.fn(), // Mock axios.post method
  };
  return {
    create: jest.fn(() => mockAxiosInstance), // Mock axios.create to return the mock instance
  };
});

// Helper to render the component with router context
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Login Component Tests', () => {
  let axios;

  beforeEach(() => {
    axios = require('axios').create(); // Get the mocked axios instance
    Cookies.get.mockClear();
    axios.post.mockClear(); // Ensure the post mock is cleared before each test
  });

  test('renders login form with email and password inputs', () => {
    renderWithRouter(<Login />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('shows error when email format is incorrect', async () => {
    renderWithRouter(<Login />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    expect(await screen.findByText(/Invalid Email Address Format/i)).toBeInTheDocument();
  });

  test('shows error when password is empty', async () => {
    renderWithRouter(<Login />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    expect(await screen.findByText(/Password cannot be empty/i)).toBeInTheDocument();
  });

  test('shows error on invalid login credentials', async () => {
    axios.post.mockResolvedValue({ status: 401 });

    renderWithRouter(<Login />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    expect(await screen.findByText(/Invalid Email Address or Password/i)).toBeInTheDocument();
  });

  test('shows error if user not found', async () => {
    axios.post.mockResolvedValue({ status: 404 });

    renderWithRouter(<Login />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    expect(await screen.findByText(/User Not Found. Please Register!/i)).toBeInTheDocument();
  });
});
