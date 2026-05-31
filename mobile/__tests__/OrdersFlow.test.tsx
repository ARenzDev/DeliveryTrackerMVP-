import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import App from '../App';
import { api } from '../src/services/api';
import { socket } from '../src/services/socket';

jest.mock('../src/services/api', () => ({
  api: {
    get: jest.fn().mockResolvedValue({ data: [] }),
    post: jest.fn().mockResolvedValue({ data: {} }),
  },
}));

jest.mock('../src/services/socket', () => ({
  socket: {
    on: jest.fn(),
    off: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  },
}));

describe('Orders Flow E2E (UI Integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.get as jest.Mock).mockResolvedValue({ data: [] });
  });

  it('should create an order and display it in the list', async () => {
    // 2. Render the App
    const { getByPlaceholderText, getByText, findByText } = render(<App />);

    // Wait for initial render to settle (loading spinner goes away)
    await findByText('Real-Time Orders (0)');

    // 3. Fill the form
    const customerInput = getByPlaceholderText('e.g. John Doe');
    const addressInput = getByPlaceholderText('e.g. 123 Main St');
    
    fireEvent.changeText(customerInput, 'Test User');
    fireEvent.changeText(addressInput, '123 Test Ave');

    // 4. Mock the POST API call for creating order
    const mockCreatedOrder = {
      _id: 'order-123',
      customerName: 'Test User',
      deliveryAddress: '123 Test Ave',
      status: 'pending',
      createdAt: new Date().toISOString(),
      location: { lat: 0, lng: 0 },
    };
    (api.post as jest.Mock).mockResolvedValue({ data: mockCreatedOrder });

    // 5. Click "Create Order"
    const createButton = getByText('Create Order');
    
    await act(async () => {
      fireEvent.press(createButton);
    });

    // 6. Simulate the WebSocket event being received from the backend
    const socketOnCalls = (socket.on as jest.Mock).mock.calls;
    const orderCreatedCalls = socketOnCalls.filter(call => call[0] === 'orderCreated');
    
    act(() => {
      orderCreatedCalls.forEach(call => {
        const callback = call[1];
        callback(mockCreatedOrder);
      });
    });

    // 7. Verify the order appears in the list via WebSocket update
    const newOrderName = await findByText('Test User');
    expect(newOrderName).toBeTruthy();
    
    const countText = await findByText('Real-Time Orders (1)');
    expect(countText).toBeTruthy();
  });
});
