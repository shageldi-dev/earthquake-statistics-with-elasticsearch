import React from "react";

interface IProps {
  component: React.ComponentType;
}

const PublicRoute: React.FC<IProps> = ({ component: ReactComponent }) => {
  return (
    <div>
      <ReactComponent />
    </div>
  );
};

export default PublicRoute;
