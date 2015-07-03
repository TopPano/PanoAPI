function [out] = GPannini(img_name, phi0, pitch, img_size, maxis_para, phi_max_ON)
% pitch = -pi/2; % pi/2 ~ -pi/2, pi/2:north pole, -pi/2:south pole
d = 1; % distance between viewing center and image sphere
if exist('maxis_para', 'var') && isfield(maxis_para, 'ell_para')
    ell_para = maxis_para.ell_para;
else
    ell_para = [0.5, 0.5, 0.5, 0.5]; % default
end
cx = ell_para(1) + ell_para(2);
phi_max = pi/2; % circular cropping
if ~exist('phi_max_ON', 'var'), phi_max_ON = 1; end

% plane xmin xmax ymin ymax
plane_xmin = -cx * (d+1)/d;
plane_xmax =  cx * (d+1)/d;
if exist('maxis_para', 'var') && isfield(maxis_para, 'h_to_w_ratio')
    h_to_w_ratio = maxis_para.h_to_w_ratio;
else
    h_to_w_ratio = 2; % default
end
if nnz(ell_para < 0)
    disp('invalid parameters of ellipse_rounded_rectangle method');
    pause;
end
plane_ymin = plane_xmin * h_to_w_ratio;
plane_ymax = plane_xmax * h_to_w_ratio;

img_w = img_size;
img_h = floor( ((plane_ymax-plane_ymin)/(plane_xmax-plane_xmin)) * img_w );
[X, Y] = meshgrid(linspace(plane_xmin, plane_xmax, img_w), linspace(plane_ymin, plane_ymax, img_h));

X = X(:); Y = Y(:);
r = sqrt(X.^2 + Y.^2);
theta = atan2(-Y, X); % -Y accounts for the coord. transform between projection plane and image space (direction of y is opposite). coord. system for theta: x right y up
N = numel(X);

%% major_axis
major_axis = zeros(N, 1);
for qi = 1 : 4
    if qi == 1,     offset = 0;
    elseif qi == 2, offset = pi/2;
    elseif qi == 3, offset = -pi;
    elseif qi == 4, offset = -pi/2;
    end
    if qi == 1 || qi == 3
        a1 = ell_para(1); a2 = ell_para(2); b1 = ell_para(3); b2 = ell_para(4);
    elseif qi == 2 || qi == 4
        b1 = ell_para(1); b2 = ell_para(2); a1 = ell_para(3); a2 = ell_para(4);
    end
    theta_min = atan2(b1, a1+a2) + offset; 
    theta_max = atan2(b1+b2, a1) + offset;
    cir_mask = theta>theta_min & theta<theta_max;
    c1 = b2/a2;
    c2 = 1/c1;
    tmp_theta = theta(cir_mask)-offset;
    major_axis(cir_mask) = ...
        ( c1*a1*cos(tmp_theta)+c2*b1*sin(tmp_theta)+sqrt(b2^2*cos(tmp_theta).^2+a2^2*sin(tmp_theta).^2-(b1*cos(tmp_theta)-a1*sin(tmp_theta)).^2) ) ./ ...
        ( c1*cos(tmp_theta).^2 + c2*sin(tmp_theta).^2 );
    straight_mask1 = (theta>=0 + offset & theta<=theta_min) & ~cir_mask;
    straight_mask2 = (theta>=theta_max & theta<=pi/2 + offset) & ~ cir_mask;
    major_axis(straight_mask1) = sec(theta(straight_mask1)-offset) * (a1+a2);
    major_axis(straight_mask2) = sec(pi/2 - (theta(straight_mask2)-offset)) * (b1+b2);
end

%% Projection
% given  d (distance between viewing center and image sphere)
%        major_axis (major axis of ellipse)
%        r (length on image coord.)
% compute phi
K = ( r ./ ((d+1)*major_axis) ).^2;
cos_t = (-K*d + sqrt(K*(1-d^2)+1)) ./ (K+1); % this part needs extra check when d>1
S = (d+1) ./ (d+cos_t);
phi = atan2(r, S.*cos_t);

[X, Y, Z] = PhiThetatoXYZ(theta, phi); % notation are reversed! phi is theta, theta is phi
X2 = X;
Y2 = [Y Z] * [cos(pitch); sin(pitch)];
Z2 = [Y Z] * [-sin(pitch); cos(pitch)];

X3 = X2;
Y3 = Z2;
Z3 = Y2;
[phi2, theta2] = XYZtoPhiTheta(X3, Y3, Z3); % notations are NOT reversed

% load texture image
I = im2double(imread(img_name));
% 3D coord. to texture coord.
L = size(I, 1);
[u, v] = PhiThetatoUV(phi2, theta2, L, phi0);
% texture mapping
out = zeros(img_h, img_w, 3);
interp_data = cell(3, 1);
[TX, TY] = meshgrid(1:size(I, 2), 1:size(I, 1)); % for texture mapping use
for c = 1 : 3
    interp_data{c} = interp2(TX, TY, I(:, :, c), u, v);
    tmp = interp_data{c};
    if phi_max_ON
        tmp(~(phi<=phi_max+1e-3)) = 1;
    end
    out(:, :, c) = reshape(tmp, img_h, []);
end