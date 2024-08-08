import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();

    ws.current = new WebSocket('ws://localhost:3001');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'newOrder') {
        setOrders((prevOrders) => [...prevOrders, message.data]);
      } else if (message.type === 'updateOrder') {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === message.data._id ? message.data : order
          )
        );
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendOrder = async () => {
    try {
      if (input) {
        await axios.post('http://localhost:3001/', { content: input });
        setInput('');
      }
    } catch (error) {
      console.error('Error sending order:', error);
    }
  };

  return (
    <div>
      <h1>All Orders</h1>
      <div>
        {orders.map((order) => (
          <div key={order._id}>
            <div>Content: {order.content}</div>
            <div>Status: {order.status}</div>
            <hr />
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendOrder}>Send Order</button>
    </div>
  );
}

export default AllOrders;