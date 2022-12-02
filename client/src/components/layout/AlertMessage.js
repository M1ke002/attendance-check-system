import Alert from "react-bootstrap/Alert";

function AlertMessage({ data }) {
  const { alert, setAlert, otherStyles = {} } = data;
  const { type, message } = alert;

  return (
    <>
      <style type="text/css">
        {`
                    .alert-light-danger {
                        background-color: #ffd8dc; 
                    }

                    .alert-dismissible {
                        padding-right: 0;
                    }

                    .alert-dismissible .btn-close {
                        top: unset;
                    }
                `}
      </style>

      <Alert
        variant={type}
        dismissible
        onClose={() => setAlert({ ...alert, show: false })}
        className="text-black d-flex align-items-center justify-content-center"
        style={{ ...otherStyles, height: "2.8rem" }}
      >
        <span>{message}</span>
      </Alert>
    </>
  );
}

export default AlertMessage;
