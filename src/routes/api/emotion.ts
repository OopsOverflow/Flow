export async function post(request) {
  const formData = new FormData();
  formData.append('image', request.body);

  const response = await fetch('http://localhost:5555/emotion', {
    method: 'POST',
    body: formData,
  });

  const data = await response.text();

  return {
    body: data,
  };
}
