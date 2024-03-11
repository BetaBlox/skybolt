/**
 * Admin config is heavily inspired by Administrate from Ruby on Rails
 *
 * @see https://administrate-demo.herokuapp.com
 */
import { AdminAttributeType } from '@repo/types';
import { UserDashboard } from './dashboards/UserDashboard';
import { PostDashboard } from './dashboards/PostDashboard';
import { ColorDashboard } from './dashboards/ColorDashboard';
import Dashboard from './dashboards/Dashboard';

export { Dashboard };

export function getDashboards(): Dashboard[] {
  return [new UserDashboard(), new PostDashboard(), new ColorDashboard()];
}

export function getDashboard(modelName: string): Dashboard {
  const dashboards = getDashboards();
  const dashboard = dashboards.find(
    (d) => d.modelName.toLowerCase() === modelName.toLowerCase(),
  );

  if (!dashboard) {
    throw new Error(`Unable to find dashboard for model: ${modelName}`);
  }

  return dashboard;
}

export function getAttributeType(
  modelName: string,
  attribute: string,
): AdminAttributeType {
  const dashboard = getDashboard(modelName);
  const { attributeTypes } = dashboard;

  const attributeType = attributeTypes.find((at) => at.name === attribute);

  if (!attributeType) {
    throw new Error(
      `Unable to find attribute type for ${dashboard.name} ${attribute}`,
    );
  }

  return attributeType;
}
