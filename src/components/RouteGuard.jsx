import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Guard de route : protège un contenu selon le rôle de l'utilisateur.
 *
 * Props :
 * - allowedRoles : tableau des rôles autorisés (ex: ['admin'])
 * - user         : objet utilisateur (ou null si non connecté)
 * - children     : contenu à afficher si autorisé
 */
export default function RouteGuard({ allowedRoles = [], user = null, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}