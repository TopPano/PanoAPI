function [u, v] = PhiThetatoUV(phi, theta, L, phi0)
u = (-L/pi)*(phi-phi0) + L;
while sum(u<0)
    u(u < 0) = u(u < 0) + 2*L;
end
while sum(u>2*L)
    u(u > 2*L) = u(u > 2*L) - 2*L;
end
v = (L/pi)*theta; % now u is in [0, 2L], v is in [0, L]
u = ((2*L-1)/(2*L)) * u + 1;%
v = ((L-1)/L) * v + 1;% now u is in [1, 2L], v is in [1, L]