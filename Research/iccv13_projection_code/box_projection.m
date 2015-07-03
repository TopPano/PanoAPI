function cube = box_projection(img_name, phi0)
% phi0: center of texture correspondence to phi = pi/2

I = im2double(imread(img_name));
texture_w = size(I, 2);
texture_h = size(I, 1);
L = texture_h;
[TX, TY] = meshgrid(1:texture_w, 1:texture_h); % for texture mapping use

target_size = 400;
w = target_size;
h = target_size;

out = cell(6, 1);
for vi = 1 : 6
    % img coord. (x, y) to Euclidean coord. (X, Y, Z)
    [x, y] = meshgrid(1:w, 1:h);
    x = x - 0.5;%
    y = y - 0.5;%
    coeffx = x(:)/w;
    coeffy = y(:)/h;
    if vi == 1
        ori = [-1;-1;1]; vec1 = [0;2;0]; vec2 = [0;0;-2];
    elseif vi == 2
        ori = [-1;1;1]; vec1 = [2;0;0]; vec2 = [0;0;-2];
    elseif vi == 3
        ori = [1;1;1]; vec1 = [0;-2;0]; vec2 = [0;0;-2];
    elseif vi == 4
        ori = [1;-1;1]; vec1 = [-2;0;0]; vec2 = [0;0;-2];
    elseif vi == 5
        ori = [-1;-1;1]; vec1 = [2;0;0]; vec2 = [0;2;0];
    elseif vi == 6
        ori = [-1;1;-1]; vec1 = [2;0;0]; vec2 = [0;-2;0];
    end
    tmpXYZ = [coeffx coeffy] * [vec1'; vec2'];
    X = tmpXYZ(:, 1) + ori(1);
    Y = tmpXYZ(:, 2) + ori(2);
    Z = tmpXYZ(:, 3) + ori(3);
    % Euclidean coord. (X, Y, Z) to Spherical coord. (phi, theta)
    [phi, theta] = XYZtoPhiTheta(X, Y, Z);
    % Spherical coord. (phi, theta) to texture coord. (u, v)
    [u, v] = PhiThetatoUV(phi, theta, L, phi0);
    % texture mapping
    u = reshape(u, h, w);
    v = reshape(v, h, w);
    R = interp2(TX, TY, I(:, :, 1), u, v);
    G = interp2(TX, TY, I(:, :, 2), u, v);
    B = interp2(TX, TY, I(:, :, 3), u, v);
    out{vi} = cat(3, R, G, B);
end

black = zeros(h, w, 3);
cube = [black out{5} black black; out{1} out{2} out{3} out{4}; black out{6} black black];

% figure; imshow(cube);

out = cube;
imwrite(out, ['Results\cube\' img_name(1:end-4) '_cube.jpg']);

