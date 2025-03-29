import { type RouteConfig, route, index, layout } from "@react-router/dev/routes";

export default [
  index('./pages/index.tsx'),
  route('/guide', './pages/guide/index.tsx', [
    index('./pages/guide/pc.tsx'),
    route('macos', './pages/guide/macos.tsx'),
    route('android', './pages/guide/android.tsx'),
    route('ios', './pages/guide/ios.tsx'),
  ]),
  route('/games', './pages/games/index.tsx'),
  route('/games/:name', './pages/games/:name.tsx'),
] satisfies RouteConfig;