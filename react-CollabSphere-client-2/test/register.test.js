import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from '../src/pages/Register/Register';
import { BrowserRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

// Mocking axios and cookies
jest.mock('js-cookie');
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

describe('Register Component Tests', () => {
  let axios;

  beforeEach(() => {
    axios = require('axios').create(); // Get the mocked axios instance
    Cookies.get.mockClear();
    axios.post.mockClear(); // Ensure the post mock is cleared before each test
  });

  test('renders register form with name, email, password, and confirm password inputs', () => {
    console.log('Rendering Register form...');
    renderWithRouter(<Register />);
    
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password', { selector: 'input[name="password"]' })).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password', { selector: 'input[name="cnfpassword"]' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
    console.log('Form rendered successfully.');
  });

  test('shows error when name is empty', async () => {
    console.log('Testing empty name validation...');
    renderWithRouter(<Register />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password', { selector: 'input[name="password"]' }), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password', { selector: 'input[name="cnfpassword"]' }), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
    
    console.log('Form submitted with empty name.');
    expect(await screen.findByText(/Name cannot be empty!/i)).toBeInTheDocument();
  });

  test('shows error when email format is incorrect', async () => {
    console.log('Testing invalid email format...');
    renderWithRouter(<Register />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText('Password', { selector: 'input[name="password"]' }), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password', { selector: 'input[name="cnfpassword"]' }), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
    
    console.log('Form submitted with invalid email.');
    expect(await screen.findByText(/Invalid Email Address Format/i)).toBeInTheDocument();
  });

  test('shows error when password is empty', async () => {
    console.log('Testing empty password validation...');
    renderWithRouter(<Register />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    
    fireEvent.change(screen.getByLabelText('Password', { selector: 'input[name="password"]' }), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Confirm Password', { selector: 'input[name="cnfpassword"]' }), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
    
    console.log('Form submitted with empty password.');
    expect(await screen.findByText(/Password cannot be empty/i)).toBeInTheDocument();
  });

  test('shows error when passwords do not match', async () => {
    console.log('Testing mismatched passwords...');
    renderWithRouter(<Register />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password', { selector: 'input[name="password"]' }), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password', { selector: 'input[name="cnfpassword"]' }), { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
    
    console.log('Form submitted with mismatched passwords.');
    expect(await screen.findByText(/Password does not match!/i)).toBeInTheDocument();
  });

  test('shows error on server error during registration', async () => {
    console.log('Testing server error response...');
    axios.post.mockResolvedValue({ status: 500 });

    renderWithRouter(<Register />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password', { selector: 'input[name="password"]' }), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password', { selector: 'input[name="cnfpassword"]' }), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    console.log('Form submitted, expecting server error.');
    expect(await screen.findByText(/Error occured. Try Again/i)).toBeInTheDocument();
  });

  test('redirects to home on successful registration', async () => {
    console.log('Testing successful registration...');
    axios.post.mockResolvedValue({ status: 200 });

    renderWithRouter(<Register />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password', { selector: 'input[name="password"]' }), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password', { selector: 'input[name="cnfpassword"]' }), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      console.log('Successful registration, checking for redirection.');
      expect(screen.queryByText(/Error occured. Try Again/i)).not.toBeInTheDocument();
    });
  });
});
