/**
 *
 * These exports define how models should be represented in the admin UI and allow for model-specific
 * configurations, like field attributes, filters.
 *
 * Each dashboard is a centralized configuration object for a specific model, offering control over how the model is
 * managed and displayed in the admin panel.
 */
import { AdminAttributeType } from '@repo/types';
import { Dashboard } from './dashboard.types';
import { UserDashboard } from './definitions/user.dashboard';
import { ColorDashboard } from './definitions/color.dashboard';
import { PostDashboard } from './definitions/post.dashboard';
import { ProductDashboard } from './definitions/product.dashboard';

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
