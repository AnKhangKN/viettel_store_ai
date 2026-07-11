from fastapi import APIRouter

from app.modules.auth.auth_routes import AuthRoutes
from app.modules.branch.branch_routes import BranchRoutes
from app.modules.user.user_routes import UserRoutes
from app.modules.sim.sim_routes import SimRoutes
from app.modules.package.package_routes import PackageRoutes

api_router = APIRouter(prefix="/api")

api_router.include_router(AuthRoutes().router)
api_router.include_router(BranchRoutes().router)
api_router.include_router(UserRoutes().router)
api_router.include_router(SimRoutes().router)
api_router.include_router(PackageRoutes().router)