import React, { useRef, useState } from 'react'
import './App.css'
import html2pdf from 'html2pdf.js'
import wayne from "./assets/wayne.jpg";

const App = () => {

  const invoiceRef = useRef()

  const [isDownloading, setIsDownloading] = useState(false)
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
    setIsDownloading(true)
    const element = invoiceRef.current
    const options = {
      margin: 0.2,
      filename: 'invoice.pdf',
      image: {
        type: 'jpeg',
        quality: 2
      },
      html2canvas: {
        scale: 1
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    }
    document.querySelectorAll(".action-column").forEach(el => {
      el.classList.add("pdf-hide");
    });

    html2pdf().set(options).from(element).save().then(() => {
      document.querySelectorAll(".action-column").forEach(el => {
        el.classList.remove("pdf-hide");
      });

      setIsDownloading(false);
    });
  }

  return (
    <>
      <div className="container" ref={invoiceRef}>
        <h2>Tax Invoice</h2>

        <div className="company-section">

          <div className="logo">
            <img src={wayne} alt="logo"></img>
          </div>

          <div className="address">
            <p>
              Q-city, 2nd Floor-Block A & Block B Survey Number-109,110,111/2,<br />
              Hyderabad, TELANGANA, 500032
            </p>
            <p><b>Mobile: </b>9836798094</p>
            <p><b>Email: </b>wayne@gmail.com</p>
          </div>

        </div>

        <div className="top-section">

          <div className="client-info">
            <h3>Client Information</h3>

            {isDownloading ? (
              <>
                <p className="pdf-text">{clientName}</p>
                <p className="pdf-text">{clientAddress}</p>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          <div className="invoice-details">
            <h3>Invoice Details</h3>

            {isDownloading ? (
              <>
                <p className="pdf-text">Invoice No: {invoiceNumber}</p>
                <p className="pdf-text">Date: {invoiceDate}</p>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

        </div>


        <table border="1">

          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Amount</th>
              <th className="action-column">Action</th>
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

                <td className="action-column">
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

        <div className="totals">
          <h3>Totals</h3>
          <p>Subtotal: ₹{subtotal}</p>
          <p>Tax: ₹{tax.toFixed(2)}</p>
          <p>Total: ₹{total.toFixed(2)}</p>
        </div>

        <div className="line"></div>

        <div className="amount">
          <p><b>Amount Payable: ₹{total.toFixed(2)}</b></p>
        </div>

        <div className="bank-details">
          <h3>Bank Details:</h3>

          <div className="row">
            <span className="label">Bank:</span>
            <span className="value">YES BANK</span>
          </div>

          <div className="row">
            <span className="label">Account #:</span>
            <span className="value">66789999222445</span>
          </div>

          <div className="row">
            <span className="label">IFSC:</span>
            <span className="value">YESBIN4567</span>
          </div>

          <div className="row">
            <span className="label">Branch:</span>
            <span className="value">Kodihalli</span>
          </div>
        </div>

        <div className="terms">
          <p><b>Notes: </b></p>
          <p>Thank you for business</p>
          <p><b>Terms and Conditions</b></p>
          <p>1. Goods once sold cannot be taken back or exchanged.</p>
          <p>2. We are not the manufacturers, company will stand for warranty as per their terms and conditions.</p>
          <p>3.Interest @24% p.a. will be charged for uncleared bills beyond 15 days.</p>

          <div className="sign"><p>Authorized Signature</p></div>
        </div>
      </div>

      <div className="base-buttons">
        <button onClick={addItem}>
          Add Item
        </button>

        <button onClick={downloadPDF}>
          Download PDF
        </button>
      </div>
    </>

  )

}

export default App