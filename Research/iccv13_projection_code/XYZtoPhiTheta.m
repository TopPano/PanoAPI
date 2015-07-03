function [phi, theta] = XYZtoPhiTheta(X, Y, Z)
if exist('X', 'var') && ~exist('Y', 'var') && ~exist('Z', 'var') && size(X, 2) == 3
    tmp = X;
    X = tmp(:, 1); Y = tmp(:, 2); Z = tmp(:, 3);
end

if sum(X==0 & Y==0 & Z==0) ~=0
    disp('frank: invalid input in XYZtoPhiTheta. (X,Y,Z) can not be (0,0,0).\n');
    pause
end

len = sqrt(X.^2 + Y.^2 + Z.^2);
len(len == 0) = len(len == 0) + eps;
phi = atan2(Y, X);
theta = acos(Z./len);