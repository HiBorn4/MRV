export const startTest = async () => {
  // Remove the body from the request if your backend does not expect any data
  await fetch("http://127.0.0.1:5000/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify({ jobNo }), // <-- Remove this entirely
  });
};


export const sendTestRecords = async (testDetails) => {
  await fetch("http://127.0.0.1:5000/record", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(testDetails),
  });
};
