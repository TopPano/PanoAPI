function theta_of_EqVP = findVP(XYZ_of_L0P1, XYZ_of_L0P2, ...
                                xy_of_L00, per_view)

draw_cirstat = 0;

N_of_L0 = cross(XYZ_of_L0P1, XYZ_of_L0P2); % normal of plane spanned by XYZ_of_L0P1 and XYZ_of_L0P2
tmp = sqrt(sum(N_of_L0.^2, 2));
for c = 1 : 3, N_of_L0(:, c) = N_of_L0(:, c) ./ tmp; end % make it unit vector
XY_of_votedEquatorVP = [N_of_L0(:, 2), -N_of_L0(:, 1)]; % cross product w/ [0 0 1]. Z is zero.
theta_of_vEqVP = atan2(XY_of_votedEquatorVP(:, 2), XY_of_votedEquatorVP(:, 1));
% two vectors w/ opposite direction are treated as the same object
tmpmask = theta_of_vEqVP<0;
theta_of_vEqVP(tmpmask) = theta_of_vEqVP(tmpmask) + pi;
tmpmask = theta_of_vEqVP==pi;
theta_of_vEqVP(tmpmask) = 0;
% now the statistics of voting is defined on the half circle domain
% change the topology of half circle into a circle,
tmp_theta = theta_of_vEqVP * 2; % now range lies in [0, 2pi)

method = 'voting'; % cir_mean, voting
if strcmp(method, 'cir_mean')
    % compute the circular mean
    mean_x = mean(cos(tmp_theta));
    mean_y = mean(sin(tmp_theta));
    R = sqrt(mean_x^2 + mean_y^2);
    cir_mean = atan2(mean_y, mean_x);
    cir_var = 1 - R;
    fprintf('circular var = %.3f\n', cir_var);
    % compute the cost as guidance of confidence
    dist_list = 1-(cos(tmp_theta)*cos(cir_mean) + sin(tmp_theta)*sin(cir_mean)); % cost = 1 - cos(theta difference). range: [0, 2]
    % optimal VP
    if cir_mean < 0, cir_mean = cir_mean + 2*pi; end % now range lies in [0, 2pi)
    theta_of_EqVP = cir_mean / 2; % lies in [0, pi)
    
    % draw circular stat
    if draw_cirstat
        figure;
        hold on;
        axis equal;
        plot(cos(tmp_theta), sin(tmp_theta), '.');
        plot(mean_x, mean_y, '.', 'color', 'r');
        plot(cos(cir_mean), sin(cir_mean), '.', 'color', 'r');
        title(sprintf('circular var = %.3f', cir_var));
    end
elseif strcmp(method, 'voting')
    % histogram count
    bin_n = 360; % 1 bin 1 degree
    half_delta = (2*pi/bin_n) / 2;
    tmpmask = tmp_theta>2*pi-half_delta;
    tmp_theta(tmpmask) = tmp_theta(tmpmask) - 2*pi; % now range lies in [-delta/2, 2pi-delta/2]
    edges = linspace(0-half_delta, 2*pi-half_delta, bin_n+1);
    acc = histc(tmp_theta, edges); % accumulator array
    acc(1) = acc(1) + acc(end); % acc(end) counts theta w/ exact value 2*pi-half_delta
    acc(end) = [];
    % find bin w/ maximun count
    [~, idx] = max(acc);
    best_theta = edges(idx) + half_delta;
    % dist_list for vis
    dist_list = 1-(cos(tmp_theta)*cos(best_theta) + sin(tmp_theta)*sin(best_theta));
    % optimal VP
    theta_of_EqVP = best_theta / 2; % lies in [0, pi)  
    
    % draw accumulator array
    if draw_cirstat
        figure; hold on;
        plot( (180/pi)*(edges(1:end-1)+half_delta)/2 , acc);
        plot( (180/pi)*theta_of_EqVP, acc(idx), 's', 'color', 'r');
    end
else
    disp('frank: wrong method name of findVP.'); pause
end
% fprintf('VP theta = %.2f degree\n', theta_of_EqVP*180/pi);

% draw
if draw_cirstat
    dist_of_L00 = cell(6, 1);
    for vi = 1 : 6
        if vi == 1, start_idx = 1; end
        end_idx = start_idx + size(xy_of_L00{vi}, 1) - 1;
        dist_of_L00{vi} = dist_list(start_idx:end_idx);
        start_idx = end_idx + 1;
    end
    
    colorN = 100;
    colorlist = colormap(jet(colorN));
    colorlist = colorlist(end:-1:1, :); % brighter color for smaller distance
    for vi = 1 : 6
        figure;
        imshow(rgb2gray(per_view{vi}));
        hold on;
        for li = 1 : size(xy_of_L00{vi}, 1)
            stat = dist_of_L00{vi}(li)/2;
            plot(xy_of_L00{vi}(li, [1 3]), xy_of_L00{vi}(li, [2 4]), 'color', colorlist( floor(1+(colorN-1)*stat) , :) );
        end
        pause(0.01)
    end
end

%% part2: compute vertical saliency for choosing positions for both hemispheres
north_angle_of_L0 = abs(asin(N_of_L0(:, 3)));
mask_of_L1 = north_angle_of_L0 < 5 * (pi/180);
XYZ_of_L1P1 = XYZ_of_L0P1(mask_of_L1, :);
XYZ_of_L1P2 = XYZ_of_L0P2(mask_of_L1, :);
arclen_of_L1 = acos(sum(XYZ_of_L1P1.*XYZ_of_L1P2, 2));
centerXY_of_L1 = (XYZ_of_L1P1(:, 1:2)+XYZ_of_L1P2(:, 1:2)) / 2;
tmp = sqrt(sum(centerXY_of_L1.^2, 2));
centerXY_of_L1(:, 1) = centerXY_of_L1(:, 1) ./ tmp;
centerXY_of_L1(:, 2) = centerXY_of_L1(:, 2) ./ tmp; % make it 2D unit vector
[thetab_of_L1P1, phib_of_L1P1] = XYZtoPhiTheta(XYZ_of_L1P1);
[thetab_of_L1P2, phib_of_L1P2] = XYZtoPhiTheta(XYZ_of_L1P2);

theta_of_VP1 = theta_of_EqVP; % lies in [0, pi)
theta_of_VP2 = theta_of_EqVP-pi; % lies in [-pi, 0)
XY_of_b1 = [cos(theta_of_VP1-pi/2) sin(theta_of_VP1-pi/2)]; % border1
XY_of_b2 = [cos(theta_of_VP1+pi/2) sin(theta_of_VP1+pi/2)]; % border2
mask_of_score1 = thetab_of_L1P1 > theta_of_VP2 & thetab_of_L1P2 > theta_of_VP2 & ...
                 thetab_of_L1P1 < theta_of_VP1 & thetab_of_L1P2 < theta_of_VP1 ;
mask_of_score2 = (thetab_of_L1P1 > theta_of_VP1 & thetab_of_L1P2 > theta_of_VP1) | ...
                 (thetab_of_L1P1 < theta_of_VP2 & thetab_of_L1P2 < theta_of_VP2) ;
weight_of_score1 = acos( centerXY_of_L1(:, 1)*XY_of_b1(1)+centerXY_of_L1(:, 2)*XY_of_b1(2) );
weight_of_score2 = acos( centerXY_of_L1(:, 1)*XY_of_b2(1)+centerXY_of_L1(:, 2)*XY_of_b2(2) ); % weight_of_score1 + weight_of_score2 must be pi
weight_of_score1 = (pi/2) - weight_of_score1;
weight_of_score2 = (pi/2) - weight_of_score2;
% if min(weight_of_score1(mask_of_score1)) < 0 || ...
%    max(weight_of_score1(mask_of_score1)) > pi/2 || ...
%    min(weight_of_score2(mask_of_score2)) < 0 || ...
%    max(weight_of_score2(mask_of_score2)) > pi/2
%    disp('frank: impossible score');
%    pause
% end
score1 = sum( weight_of_score1(mask_of_score1) .* arclen_of_L1(mask_of_score1) );
score2 = sum( weight_of_score2(mask_of_score2) .* arclen_of_L1(mask_of_score2) );
% fprintf('score1 %.3f score2 %.3f\n', score1, score2);
if score1 > score2
    theta_of_EqVP = theta_of_EqVP - pi;
end