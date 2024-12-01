import React, { useState } from 'react';
import { Modal, Text, TextInput, Textarea, Button, Group } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import axios from 'axios'; // Import Axios for making API calls

function CreateCampaignModal({ opened, onClose }) {
  const [participants, setParticipants] = useState([{ name: '', email: '' }]);
  const [additionalContext, setAdditionalContext] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state
  const [errorMessage, setErrorMessage] = useState(''); // Track error messages
  const [successMessage, setSuccessMessage] = useState(''); // Track success messages

  // Function to handle adding a new participant field
  const addParticipantField = () => {
    setParticipants([...participants, { name: '', email: '' }]);
  };

  // Function to handle updating participant inputs (name or email)
  const updateParticipant = (index, field, value) => {
    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    setParticipants(newParticipants);
  };

  // Function to handle removing a participant field
  const removeParticipantField = (index) => {
    const newParticipants = participants.filter((_, i) => i !== index);
    setParticipants(newParticipants);
  };

  // Function to send the campaign request to the backend
  const handleBeginCampaign = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const campaignData = {
      participants,
      additional_context: additionalContext,
    };

    try {
      console.log("heres the port")
      console.log(process.env.REACT_APP_BACKEND_URL)
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/campaign/create_campaign`, campaignData);
      if (response.data.status === 'success') {
        setSuccessMessage('Campaign started successfully. Emails are being sent!');
        // Close the modal after a small delay to allow the user to see the message
        setTimeout(() => {
          onClose(); // Close the modal
          resetFields(); // Reset fields after modal is closed
          setLoading(false);
        }, 1000); // Wait for 1 second before closing
      }
    } catch (error) {
      console.log(error)
      setErrorMessage('Failed to start the campaign. Please try again.');
      setLoading(false);
    }
  };

   const resetFields = () => {
    setParticipants([{ name: '', email: '' }]); // Reset to one empty participant
    setAdditionalContext(''); // Clear additional context
    setErrorMessage(''); // Clear error message
    setSuccessMessage(''); // Clear success message
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text size="xl" weight={700}>Create New Campaign</Text>}
      size="lg" // Making the modal larger
    >
      {/* Participants Section */}
      <div style={{ marginBottom: '20px' }}>
        <Text size="lg" weight={500} mb="md">
          Participants
        </Text>

        {participants.map((participant, index) => (
          <Group key={index} mb="sm" align="center" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <TextInput
              value={participant.name}
              onChange={(event) => updateParticipant(index, 'name', event.currentTarget.value)}
              placeholder="Enter name"
              size="md"
              style={{ width: '38%' }}
              radius="md"
            />
            <TextInput
              value={participant.email}
              onChange={(event) => updateParticipant(index, 'email', event.currentTarget.value)}
              placeholder="Enter email"
              size="md"
              style={{ width: '38%' }}
              radius="md"
            />
            <Button
              color="red"
              size="sm"
              onClick={() => removeParticipantField(index)}
              disabled={participants.length === 1} // Disable if it's the last participant field
              variant="outline"
            >
              <IconTrash size={16} />
            </Button>
          </Group>
        ))}

        <Button
          color="violet"
          variant="light"
          onClick={addParticipantField}
          fullWidth
          style={{ marginTop: '10px' }}
        >
          + Add Participant
        </Button>
      </div>

      {/* Additional Context Section */}
      <div style={{ marginBottom: '10px' }}> {/* Reduced margin bottom */}
        <Text size="lg" weight={500} mb="xs">
          Additional Context
        </Text>
        <Text size="sm" mb="xs" color="dimmed">
          Any additional context you would like to inject into the generation. For example, a specific event to mention, or a specific resource to request.
        </Text>
        <Textarea
          value={additionalContext}
          onChange={(event) => setAdditionalContext(event.currentTarget.value)}
          placeholder="Add additional context here..."
          size="md"
          radius="md"
          style={{ width: '100%', height: '70px' }}
          multiline
          minRows={10}
          maxRows={40}
        />
      </div>

      {/* Error and Success Messages */}
      {errorMessage && <Text color="red" mb="sm">{errorMessage}</Text>}
      {successMessage && <Text color="green" mb="sm">{successMessage}</Text>}

      {/* Begin Campaign Button */}
      <Button
        color="violet" // Changed button color to purple
        fullWidth
        size="lg"
        onClick={handleBeginCampaign}
        loading={loading} // Show loading spinner when the button is clicked
      >
        {loading ? 'Sending...' : 'Begin Campaign'}
      </Button>
    </Modal>
  );
}

export default CreateCampaignModal;
