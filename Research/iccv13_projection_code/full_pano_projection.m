function result_img = full_pano_projection(img_name, h_to_w_ratio, roundness)
% img_name: the name of the input image
% h_to_w_ratio: aspect ratio of the rounded rectangle. (between 1 and 2)
% roundness: the roundness of the rounded rectangle. (between 0 and 1)

output_width = 1200; % the width of the result image

if ~exist('h_to_w_ratio', 'var') || numel(h_to_w_ratio) == 0, h_to_w_ratio = 1; end
h_to_w_ratio = min(max(h_to_w_ratio, 1), sqrt(3));

if ~exist('roundness', 'var') || numel(roundness) == 0, roundness = 0.5; end
roundness = min(max(roundness, 0), 1);

%% line-related preprocessing
% cube projection
box_projection(img_name, pi/2);
% find lines
[XYZ_of_L0P1, XYZ_of_L0P2, xy_of_L00, xy_of_L0, view_of_L0, per_view] = ...
    find_lines_from_cube(img_name);
% find VP
theta_of_EqVP = findVP(XYZ_of_L0P1, XYZ_of_L0P2, xy_of_L00, per_view);
phi0 = pi/2 - (theta_of_EqVP-pi/2);

%% Projection
pitch = 0;
img_w = floor(output_width / 2);
maxis_para.h_to_w_ratio = h_to_w_ratio;
R0 = 1; R90 = h_to_w_ratio;
maxis_para.ell_para = [R0-roundness, roundness, R90-roundness, roundness];
phi_max_ON = 1;
out{1} = GPannini(img_name, phi0   , pitch, img_w, maxis_para, phi_max_ON);
out{2} = GPannini(img_name, phi0+pi, pitch, img_w, maxis_para, phi_max_ON);
result_img = [out{1} out{2}];
imwrite(result_img, ['Results\' img_name]);