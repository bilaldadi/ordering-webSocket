import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function Operations() {
  const [orders, setOrders] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/operations');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching pending orders:', error);
      }
    };

    fetchPendingOrders();

    ws.current = new WebSocket('ws://localhost:3001');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'updateOrder') {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === message.data._id ? message.data : order
          ).filter(order => order.status === 'pending')
        );
      } else if (message.type === 'newOrder' && message.data.status === 'pending') {
        setOrders((prevOrders) => [...prevOrders, message.data]);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const markAsCompleted = async (id) => {
    try {
      await axios.put(`http://localhost:3001/operations/${id}`, { status: 'completed' });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div>
      <h1>Pending Orders</h1>
      <div>
        {orders.map((order) => (
          <div key={order._id}>
            <div>Content: {order.content}</div>
            <div>Status: {order.status}</div>
            <button onClick={() => markAsCompleted(order._id)}>Mark as Completed</button>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Operations;