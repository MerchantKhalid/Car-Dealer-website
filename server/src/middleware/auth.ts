// import { Request, Response, NextFunction } from 'express';
// import { verifyAccessToken, TokenPayload } from '../utils/jwt';

// declare global {
//   namespace Express {
//     interface Request {
//       user?: TokenPayload;
//     }
//   }
// }

// export function authenticate(req: Request, res: Response, next: NextFunction) {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ error: 'Access token required' });
//     }

//     const token = authHeader.split(' ')[1];
//     const payload = verifyAccessToken(token);
//     req.user = payload;
//     next();
//   } catch (error) {
//     return res.status(401).json({ error: 'Invalid or expired token' });
//   }
// }

// export function authorize(...roles: string[]) {
//   return (req: Request, res: Response, next: NextFunction) => {
//     if (!req.user) {
//       return res.status(401).json({ error: 'Authentication required' });
//     }
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ error: 'Insufficient permissions' });
//     }
//     next();
//   };
// }

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }
    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

type Role = 'ADMIN' | 'CUSTOMER' | 'SALES_AGENT';

export function authorize(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!roles.includes(req.user.role as Role)) {
      return res
        .status(403)
        .json({ error: 'Access denied: insufficient permissions' });
    }
    next();
  };
}
