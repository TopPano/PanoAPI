function [X, Y, Z] = PhiThetatoXYZ(phi, theta)
% phi: angle between XY-plane-projected vector of (X,Y,Z) and X-axis
% theta: angle between (X,Y,Z) and Z-axis
X = sin(theta).*cos(phi);
Y = sin(theta).*sin(phi);
Z = cos(theta);