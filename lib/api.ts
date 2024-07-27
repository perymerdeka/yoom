export const createMeeting = async (): Promise<string> => {
    const response = await fetch('http://localhost:5000/api/create-meeting/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to create meeting');
    }
  
    const data = await response.json();

    console.log(data.meetingId)
    return data.meetingId;
  };
  