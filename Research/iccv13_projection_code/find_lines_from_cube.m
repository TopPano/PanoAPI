function [XYZ_of_L0P1, XYZ_of_L0P2, xy_of_L00, xy_of_L0, view_of_L0, per_view] = ...
    find_lines_from_cube(img_name)

draw_6views = 0;

cube = imread(['Results/cube/' img_name(1:end-4) '_cube.jpg']);
cube_L = size(cube, 1) / 3;
% load 6 perspective views
per_view = cell(6, 1);
per_view{2} = cube(cube_L+1:2*cube_L, cube_L+1:2*cube_L, :); % front
per_view{1} = cube(cube_L+1:2*cube_L, 1:cube_L, :); % left
per_view{4} = cube(cube_L+1:2*cube_L, 3*cube_L+1:end, :); % back
per_view{3} = cube(cube_L+1:2*cube_L, 2*cube_L+1:3*cube_L, :); % right
per_view{5} = cube(1:cube_L, cube_L+1:2*cube_L, :); % up
per_view{6} = cube(2*cube_L+1:end, cube_L+1:2*cube_L, :); % down
addpath('lsd-1.5/');
xy_of_L00 = cell(6, 1);
view = cell(6, 1);
for vi = 1 : 6
    xy_of_L00{vi} = lsd(double(rgb2gray(per_view{vi})));
    xy_of_L00{vi}(:, 1:4) = xy_of_L00{vi}(:, 1:4) + 1; % +1 for matlab coordinate
    xy_of_L00{vi}(xy_of_L00{vi} < (1-0.5)) = (1-0.5);%
    xy_of_L00{vi}(xy_of_L00{vi} > (cube_L+0.5)) = (cube_L+0.5);%
    view{vi} = vi*ones(size(xy_of_L00{vi}, 1), 1);
end
% draw 6 views
if draw_6views
    for vi = 1 : 6
        figure;
        imshow(per_view{vi});
        hold on;
        for li = 1 : size(xy_of_L00{vi}, 1)
            plot(xy_of_L00{vi}(li, [1 3]), xy_of_L00{vi}(li, [2 4]), 'r');
        end
        pause(0.01)
    end
end
% combine
xy_of_L0 = [xy_of_L00{1}; xy_of_L00{2}; xy_of_L00{3}; xy_of_L00{4}; xy_of_L00{5}; xy_of_L00{6}];
view_of_L0 = [view{1}; view{2}; view{3}; view{4}; view{5}; view{6}];
L0_n = size(xy_of_L0, 1);

% compute XYZ_of_L0 from xy_of_L0
XYZ_of_L0P1 = zeros(L0_n, 3);
XYZ_of_L0P2 = zeros(L0_n, 3);
for vi = 1 : 6
    L0_p1 = xy_of_L0(view_of_L0==vi, 1:2);
    L0_p2 = xy_of_L0(view_of_L0==vi, 3:4);
    L0_p = [L0_p1; L0_p2];
    x = L0_p(:, 1); y = L0_p(:, 2);
    w = cube_L; h = cube_L;
    % from xy to XYZ
    x = x - 0.5;%
    y = y - 0.5;%
    coeffx = x(:)/w;
    coeffy = y(:)/h;
    if vi == 1,     ori = [-1;-1;1]; vec1 = [0;2;0]; vec2 = [0;0;-2];
    elseif vi == 2, ori = [-1;1;1]; vec1 = [2;0;0]; vec2 = [0;0;-2];
    elseif vi == 3, ori = [1;1;1]; vec1 = [0;-2;0]; vec2 = [0;0;-2];
    elseif vi == 4, ori = [1;-1;1]; vec1 = [-2;0;0]; vec2 = [0;0;-2];
    elseif vi == 5, ori = [-1;-1;1]; vec1 = [2;0;0]; vec2 = [0;2;0];
    elseif vi == 6, ori = [-1;1;-1]; vec1 = [2;0;0]; vec2 = [0;-2;0];
    end
    tmpXYZ = [coeffx coeffy] * [vec1'; vec2'];
    X = tmpXYZ(:, 1) + ori(1);
    Y = tmpXYZ(:, 2) + ori(2);
    Z = tmpXYZ(:, 3) + ori(3);
    len = sqrt(X.^2 + Y.^2 + Z.^2);
    X = X./len; Y = Y./len; Z = Z./len; % normalize to unit length in order to compute arclen_of_L0

    X = reshape(X, [], 2); Y = reshape(Y, [], 2); Z = reshape(Z, [], 2);
    XYZ_of_L0P1(view_of_L0==vi, :) = [X(:, 1) Y(:, 1) Z(:, 1)];
    XYZ_of_L0P2(view_of_L0==vi, :) = [X(:, 2) Y(:, 2) Z(:, 2)];
end
