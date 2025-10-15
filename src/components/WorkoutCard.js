import { Card, Badge } from 'react-bootstrap';

export default function WorkoutCard({ workout }) {
  const capitalizeFirstLetter = (str) => {
    if (!str) return 'Active';
    	
    	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  	};

	const status = capitalizeFirstLetter(workout.status || 'active');
	const badgeColor = status === 'Complete' ? 'success' : 'secondary';

return (
<Card className="border rounded-0 h-100 mb-3" style={{ minHeight: '180px' }}>
  <Card.Body className="p-4 d-flex flex-column justify-content-between">
    <div>
      <Card.Title className="fw-semi-bold mb-2">{workout.name}</Card.Title>
      <Card.Text className="d-block text-muted mb-1">Duration: {workout.duration}</Card.Text>
      <small className="d-block text-muted mb-1">
        Date Added: {new Date(workout.dateAdded).toLocaleDateString()}
      </small>
    </div>
    <div className="mt-3">
      Status: <Badge bg={badgeColor} className="text-uppercase">{status}</Badge>
    </div>
  </Card.Body>
</Card>
);
}
