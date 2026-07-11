import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'var(--color-success)';
      case 'COMPLETED':
        return 'var(--color-primary)';
      case 'ON_HOLD':
        return 'var(--color-warning)';
      default:
        return 'var(--color-gray-500)';
    }
  };

  const getStatusBadge = (status) => ({
    backgroundColor: getStatusColor(status),
    color: 'var(--color-white)',
    padding: 'var(--spacing-1) var(--spacing-3)',
    borderRadius: 'var(--border-radius-full)',
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-medium)',
    display: 'inline-block',
  });

  const handleClick = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <div
      className="card"
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
        ':hover': {
          transform: 'translateY(-4px)',
          boxShadow: 'var(--shadow-lg)',
        },
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 'var(--spacing-2)',
      }}>
        <h3 style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-gray-900)',
          margin: 0,
        }}>
          {project.name}
        </h3>
        <span style={getStatusBadge(project.status)}>
          {project.status}
        </span>
      </div>

      <div style={{
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-gray-500)',
        marginTop: 'var(--spacing-2)',
      }}>
        <div>Leader: {project.leader?.name || 'Not assigned'}</div>
        <div style={{ marginTop: 'var(--spacing-1)' }}>
          Members: {project.members?.length || 0}
        </div>
      </div>

      <div style={{
        marginTop: 'var(--spacing-4)',
        paddingTop: 'var(--spacing-3)',
        borderTop: 'var(--border-width) solid var(--border-color)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}>
        <span style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-primary)',
          fontWeight: 'var(--font-weight-medium)',
        }}>
          View Details →
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;