import React, { useRef, useState } from 'react'
import './App.css'
import html2pdf from 'html2pdf.js'

const App = () => {

  const invoiceRef = useRef()

  const [clientName, setClientName] = useState("")
  const [clientAddress, setClientAddress] = useState("")

  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [invoiceDate, setInvoiceDate] = useState("")

  const [items, setItems] = useState([
    {
      description: "",
      quantity: 1,
      rate: 0
    }
  ])

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items]
    updatedItems[index][field] = value
    setItems(updatedItems)
  }

  const addItem = () => {
    setItems([
      ...items,
      {
        description: "",
        quantity: 1,
        rate: 0
      }
    ])
  }

  const deleteItem = (indexToDelete) => {
    if (items.length === 1) {
      return
    }

    const filteredItems = items.filter(
      (_, index) => index !== indexToDelete
    )
    setItems(filteredItems)
  }

  const subtotal = items.reduce((acc, item) => {
    return acc + (item.quantity * item.rate)
  }, 0)
  const tax = subtotal * 0.18
  const total = subtotal + tax

  const downloadPDF = () => {
    const hasEmptyItem = items.some((item) =>
      item.description === "" ||
      item.quantity === 0 ||
      item.rate === 0
    )

    if (
      clientName === "" ||
      clientAddress === "" ||
      invoiceNumber === "" ||
      invoiceDate === "" ||
      hasEmptyItem
    ) {

      const proceed = window.confirm(
        "Some fields are missing. Do you still want to download the invoice?"
      )

      if (!proceed) {
        return
      }
    }
    const element = invoiceRef.current
    const options = {
      //margin: 1,
      margin: 0.3,
      filename: 'invoice.pdf',
      image: {
        type: 'jpeg',
        quality: 1
      },
      html2canvas: {
        scale: 2
        
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait'
      }
    }
    html2pdf().set(options).from(element).save()
  }

  return (
    <div className="container" ref={invoiceRef}>

      <h1>Invoice Builder</h1>

      <div className="top-section">

        <div className="client-info">
          <h3>Client Information</h3>
          <input
            type="text"
            placeholder="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Client Address"
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
          />
        </div>


        <div className="invoice-details">
          <h3>Invoice Details</h3>
          <input
            type="text"
            placeholder="Invoice Number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />

          <input
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
        </div>

      </div>


      <table border="1">

        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {items.map((item, index) => (

            <tr key={index}>

              <td>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", Number(e.target.value))
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) =>
                    handleItemChange(index, "rate", Number(e.target.value))
                  }
                />
              </td>

              <td>
                {item.quantity * item.rate}
              </td>

              <td>
                <button
                  onClick={() => deleteItem(index)}
                >
                  Delete
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <div className="base-buttons">
        <button onClick={addItem}>
          Add Item
        </button>

        <button onClick={downloadPDF}>
          Download PDF
        </button>
      </div>

      <div className="totals">
        <h3>Totals</h3>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Tax: ₹{tax.toFixed(2)}</p>
        <p>Total: ₹{total.toFixed(2)}</p>
      </div>

    </div>
  )
}

export default App