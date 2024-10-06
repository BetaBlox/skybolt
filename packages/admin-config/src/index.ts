/**
 * Admin config is heavily inspired by Administrate from Ruby on Rails
 *
 * @see https://administrate-demo.herokuapp.com
 */
import { AdminAttributeType } from '@repo/types';
import { Dashboard } from './dashboard.types';
import { UserDashboard } from './dashboards/user.dashboard';
import { ColorDashboard } from './dashboards/color.dashboard';
import { PostDashboard } from './dashboards/post.dashboard';
import { ProductDashboard } from './dashboards/product.dashboard';

export { Dashboard };

export function getDashboards(): Dashboard<unknown>[] {
  return [UserDashboard, ProductDashboard, PostDashboard, ColorDashboard];
}

export function getDashboard(modelName: string): Dashboard<unknown> {
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
