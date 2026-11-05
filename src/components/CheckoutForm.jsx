import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../hooks/useCart.js";

const MAHALLAHS = [
  "Ali",
  "Aminah",
  "Faruq",
  "Asiah",
  "Bilal",
  "Hafsa",
  "Uthman",
  "Zubair",
  "Maryam",
];

// A plain function: values in, errors object out. Empty object = valid.
function validate(values) {
  const errors = {};
  if (values.name.trim().length < 3)
    errors.name = "Enter your name (at least 3 characters).";
  if (!values.mahallah) errors.mahallah = "Choose your mahallah.";
  if (
    !values.pickupTime ||
    values.pickupTime < "07:00" ||
    values.pickupTime > "22:00"
  ) {
    errors.pickupTime = "Choose a pickup time between 07:00 and 22:00.";
  }
  return errors;
}

function CheckoutForm() {
  const [values, setValues] = useState({
    name: "",
    mahallah: "",
    pickupTime: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { placeOrder } = useCart();

  // Feature 8: Suggest earliest pickup time (now + 20 minutes), refreshed every minute
  useEffect(() => {
    const calculateEarliestTime = () => {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 20); // 20 minutes preparation time
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    // Set initial pickup time on mount
    setValues((prev) => ({ ...prev, pickupTime: calculateEarliestTime() }));

    // Refresh every minute (60000 ms)
    const timer = setInterval(() => {
      setValues((prev) => ({ ...prev, pickupTime: calculateEarliestTime() }));
    }, 60000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, []);

  // One handler for every input: the input's name matches a key in values.

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault(); // stop the page reloading
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length === 0) {
      placeOrder(values);
      navigate("/orders");
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h3>Checkout</h3>

      <label htmlFor="name">Name</label>
      <input
        id="name"
        name="name"
        value={values.name}
        onChange={handleChange}
      />
      {errors.name && <p className="field-error">{errors.name}</p>}

      <label htmlFor="mahallah">Mahallah</label>
      <select
        id="mahallah"
        name="mahallah"
        value={values.mahallah}
        onChange={handleChange}
      >
        <option value="">Select…</option>
        {MAHALLAHS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      {errors.mahallah && <p className="field-error">{errors.mahallah}</p>}

      <label htmlFor="pickupTime">Pickup time</label>
      <input
        type="time"
        id="pickupTime"
        name="pickupTime"
        value={values.pickupTime}
        onChange={handleChange}
      />
      {errors.pickupTime && <p className="field-error">{errors.pickupTime}</p>}
      <button type="submit" className="btn">
        Place order
      </button>
    </form>
  );
}

export default CheckoutForm;